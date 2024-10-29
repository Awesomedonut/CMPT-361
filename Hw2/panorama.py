import cv2 as cv
import numpy as np
import random
from typing import Tuple, List, Optional

random.seed(42)  # random seed so that RANSAC results are always the same. set to 42 which is a common seed num
np.random.seed(42)

def create_panorama(im1: np.ndarray, im2: np.ndarray, is_fastr: bool = False) -> np.ndarray:
    keypoints_data: List[List[float]] = extract_and_match_keypoints(im1, im2)
    homography_matrix: np.ndarray = find_homography(keypoints_data, is_fastr=is_fastr)
    return stitch_ims(im1, im2, homography_matrix)

def extract_and_match_keypoints(im1: np.ndarray, im2: np.ndarray) -> List[List[float]]:
    keypoints1: List
    descriptors1: np.ndarray
    keypoints2: List
    descriptors2: np.ndarray
    keypoints1, descriptors1 = detect_keypoints(im1)
    keypoints2, descriptors2 = detect_keypoints(im2)
    return match_keypoints(keypoints1, keypoints2, descriptors1, descriptors2)

def detect_keypoints(img: np.ndarray) -> Tuple[List, np.ndarray]:
    gray_img: np.ndarray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    orb_detector: cv.ORB = cv.ORB_create() # use ORB method
    return orb_detector.detectAndCompute(gray_img, None)

def match_keypoints(keypoints1: List, keypoints2: List, 
                   descriptors1: np.ndarray, descriptors2: np.ndarray) -> List[List[float]]:
    matches: List = cv.BFMatcher(cv.NORM_HAMMING, crossCheck=True).match(descriptors1, descriptors2) # use BFMatcher to match descr
    matches = sorted(matches, key=lambda x: x.distance)

    matched_pts: List[List[float]] = []
    for match in matches:
        p1: Tuple[float, float] = keypoints1[match.queryIdx].pt
        p2: Tuple[float, float] = keypoints2[match.trainIdx].pt
        matched_pts.append([p1[0], p1[1], p2[0], p2[1]])

    return matched_pts

def compute_homography(points: List[List[float]]) -> np.ndarray:
    equation_matrix: List[List[float]] = []
    for point in points:
        x1: float = point[0]
        y1: float = point[1]
        x2: float = point[2]
        y2: float = point[3]
        equation_matrix.append([x1, y1, 1, 0, 0, 0, -x2 * x1, -x2 * y1, -x2])
        equation_matrix.append([0, 0, 0, x1, y1, 1, -y2 * x1, -y2 * y1, -y2])

    equation_matrix_np: np.ndarray = np.array(equation_matrix)
    _, _, vh = np.linalg.svd(equation_matrix_np)
    homography: np.ndarray = vh[-1, :].reshape(3, 3)
    return homography / homography[2, 2]

def find_homography(matched_points: List[List[float]], 
                        is_fastr: bool) -> np.ndarray:
    if is_fastr == True:
        max_iterations: int = 5000
        distance_threshold: float = 5.0
    else:  # it is FAST
        max_iterations: int = 6000
        distance_threshold: float = 7.0
    
    best_inliers: List[List[float]] = []
    best_homography: Optional[np.ndarray] = None
    
    for _ in range(max_iterations):
        sample_points: List[List[float]] = random.choices(matched_points, k=4)
        homography: np.ndarray = compute_homography(sample_points)
        current_inliers: List[List[float]] = find_inliers(matched_points, homography, distance_threshold)
        
        if len(current_inliers) > len(best_inliers):
            best_inliers = current_inliers
            best_homography = homography
    
    return best_homography

def find_inliers(points: List[List[float]], 
                 homography: np.ndarray,
                 threshold: float) -> List[List[float]]:
    inliers: List[List[float]] = []
    for point in points:
        p1: np.ndarray = np.array([point[0], point[1], 1]).reshape(3, 1)
        p2: np.ndarray = np.array([point[2], point[3], 1]).reshape(3, 1)
        
        transformed_p1: np.ndarray = np.dot(homography, p1)
        transformed_p1 = transformed_p1 / transformed_p1[2]
        
        if np.linalg.norm(p2 - transformed_p1) < threshold:
            inliers.append(point)
    
    return inliers

def stitch_ims(im1: np.ndarray, im2: np.ndarray, 
                 homography: np.ndarray) -> np.ndarray:
    
    height1, width1 = im2.shape[:2]
    height2, width2 = im1.shape[:2]

    corners1: np.ndarray = float([[0, 0], [0, height1], [width1, height1], [width1, 0]]).reshape(-1, 1, 2)
    corners2: np.ndarray = float([[0, 0], [0, height2], [width2, height2], [width2, 0]]).reshape(-1, 1, 2)
    
    transformed_corners2: np.ndarray = cv.perspectiveTransform(corners2, homography)
    all_corners: np.ndarray = np.concatenate((corners1, transformed_corners2), axis=0)

    min_x, min_y = int(all_corners.min(axis=0).ravel() - 0.5)
    max_x, max_y = int(all_corners.max(axis=0).ravel() + 0.5)

    translation_matrix: np.ndarray = np.array([
        [1, 0, -min_x],
        [0, 1, -min_y],
        [0, 0, 1]
    ])

    final_homography: np.ndarray = translation_matrix.dot(homography)
    output_size: Tuple[int, int] = (max_x - min_x, max_y - min_y)
    
    warped_im: np.ndarray = cv.warpPerspective(im1, final_homography, output_size)
    warped_im[-min_y:height1 + (-min_y), -min_x:width1 + (-min_x)] = im2
    
    return warped_im