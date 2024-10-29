import cv2 as cv
import numpy as np
import random
from typing import Tuple, List, Optional

def create_panorama(im1: np.ndarray, im2: np.ndarray) -> np.ndarray:
    keypoints_data = extract_and_match_keypoints(im1, im2)
    homography_matrix = find_best_homography(keypoints_data)
    return stitch_ims(im1, im2, homography_matrix)

def extract_and_match_keypoints(im1: np.ndarray, im2: np.ndarray) -> List[List[float]]:
    keypoints1, descriptors1 = detect_keypoints(im1)
    keypoints2, descriptors2 = detect_keypoints(im2)
    return match_keypoints(keypoints1, keypoints2, descriptors1, descriptors2)

def detect_keypoints(img: np.ndarray) -> Tuple[List, np.ndarray]:
    gray_img = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    orb_detector = cv.ORB_create()
    return orb_detector.detectAndCompute(gray_img, None)

def match_keypoints(keypoints1: List, keypoints2: List, 
                   descriptors1: np.ndarray, descriptors2: np.ndarray) -> List[List[float]]:
    matcher = cv.BFMatcher(cv.NORM_HAMMING, crossCheck=True)
    matches = matcher.match(descriptors1, descriptors2)
    matches = sorted(matches, key=lambda x: x.distance)

    matched_pts = []
    for match in matches:
        p1 = keypoints1[match.queryIdx].pt
        p2 = keypoints2[match.trainIdx].pt
        matched_pts.append([p1[0], p1[1], p2[0], p2[1]])

    return matched_pts

def compute_homography(points: List[List[float]]) -> np.ndarray:
    equation_matrix = []
    for point in points:
        x1, y1 = point[0], point[1]
        x2, y2 = point[2], point[3]
        equation_matrix.append([x1, y1, 1, 0, 0, 0, -x2 * x1, -x2 * y1, -x2])
        equation_matrix.append([0, 0, 0, x1, y1, 1, -y2 * x1, -y2 * y1, -y2])

    equation_matrix = np.array(equation_matrix)
    _, _, vh = np.linalg.svd(equation_matrix)
    homography = vh[-1, :].reshape(3, 3)
    return homography / homography[2, 2]

def find_best_homography(matched_points: List[List[float]], 
                        max_iterations: int = 5000,
                        distance_threshold: float = 5.0) -> np.ndarray:
    best_inliers = []
    best_homography = None
    
    for _ in range(max_iterations):
        sample_points = random.choices(matched_points, k=4)
        homography = compute_homography(sample_points)
        current_inliers = find_inliers(matched_points, homography, distance_threshold)
        
        if len(current_inliers) > len(best_inliers):
            best_inliers = current_inliers
            best_homography = homography
    
    return best_homography

def find_inliers(points: List[List[float]], 
                 homography: np.ndarray,
                 threshold: float) -> List[List[float]]:
    inliers = []
    for point in points:
        p1 = np.array([point[0], point[1], 1]).reshape(3, 1)
        p2 = np.array([point[2], point[3], 1]).reshape(3, 1)
        
        transformed_p1 = np.dot(homography, p1)
        transformed_p1 = transformed_p1 / transformed_p1[2]
        
        if np.linalg.norm(p2 - transformed_p1) < threshold:
            inliers.append(point)
    
    return inliers

def stitch_ims(im1: np.ndarray, im2: np.ndarray, 
                 homography: np.ndarray) -> np.ndarray:
    height1, width1 = im2.shape[:2]
    height2, width2 = im1.shape[:2]

    corners1 = np.float32([[0, 0], [0, height1], [width1, height1], [width1, 0]]).reshape(-1, 1, 2)
    corners2 = np.float32([[0, 0], [0, height2], [width2, height2], [width2, 0]]).reshape(-1, 1, 2)
    
    transformed_corners2 = cv.perspectiveTransform(corners2, homography)
    all_corners = np.concatenate((corners1, transformed_corners2), axis=0)

    min_x, min_y = np.int32(all_corners.min(axis=0).ravel() - 0.5)
    max_x, max_y = np.int32(all_corners.max(axis=0).ravel() + 0.5)

    translation_matrix = np.array([
        [1, 0, -min_x],
        [0, 1, -min_y],
        [0, 0, 1]
    ])

    final_homography = translation_matrix.dot(homography)
    output_size = (max_x - min_x, max_y - min_y)
    
    warped_im = cv.warpPerspective(im1, final_homography, output_size)
    warped_im[-min_y:height1 + (-min_y), -min_x:width1 + (-min_x)] = im2
    
    return warped_im