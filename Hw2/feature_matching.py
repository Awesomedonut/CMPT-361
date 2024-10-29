import cv2 as cv
import numpy as np
import time
from typing import List, Tuple, Optional

def generate_descriptors(img1: np.ndarray, img2: np.ndarray, 
                        corners1: np.ndarray, corners2: np.ndarray, 
                        is_fastr: bool=False) -> Tuple[List, List, np.ndarray, np.ndarray, float]:
    start_time = time.time()
    
    img1_gray = cv.cvtColor(img1, cv.COLOR_BGR2GRAY)
    img2_gray = cv.cvtColor(img2, cv.COLOR_BGR2GRAY)
    keypoints1, keypoints2 = get_points(corners1, corners2)
    descriptors1, descriptors2 = compute_descriptors(img1_gray, img2_gray, keypoints1, keypoints2)
    
    desc_time = time.time() - start_time
    print(f"{'FASTR' if is_fastr else 'FAST'} descriptor generation time: {desc_time:.4f} seconds")
    
    return keypoints1, keypoints2, descriptors1, descriptors2, desc_time

def match_features(img1: np.ndarray, img2: np.ndarray, 
                  keypoints1: List, keypoints2: List, 
                  desc1: np.ndarray, desc2: np.ndarray, 
                  is_fastr: bool=False) -> Tuple[np.ndarray, float]:
    start_time = time.time()
    matches = find_matches(desc1, desc2)
    match_img = generate_match_visualization(img1, img2, keypoints1, keypoints2, matches)
    
    match_time = time.time() - start_time
    print(f"{'FASTR' if is_fastr else 'FAST'} matching time: {match_time:.4f} seconds")
    print(f"num of matches: {len(matches)}")
    
    return match_img, match_time

def get_points(corners1: np.ndarray, corners2: np.ndarray) -> Tuple[List, List]:
    y1, x1 = np.where(corners1)
    y2, x2 = np.where(corners2)
    
    p1 = [cv.KeyPoint(float(x), float(y), 3.0) for x, y in zip(x1, y1)]
    p2 = [cv.KeyPoint(float(x), float(y), 3.0) for x, y in zip(x2, y2)]
    
    return p1, p2

def compute_descriptors(img1_gray: np.ndarray, img2_gray: np.ndarray, 
                       p1: List, p2: List) -> Tuple[np.ndarray, np.ndarray]:
    orb = cv.ORB_create( # use ORB method
        nfeatures=10000,  
        scaleFactor=1.2,
        nlevels=8,
        edgeThreshold=31,
        firstLevel=0,
        WTA_K=2,
        patchSize=31,
        fastThreshold=20
    )
    
    _, des1 = orb.compute(img1_gray, p1)
    _, des2 = orb.compute(img2_gray, p2)
        
    return des1, des2

def find_matches(des1: np.ndarray, des2: np.ndarray, 
                thresh: float=30) -> List:
    bf = cv.BFMatcher()
    matches = bf.knnMatch(des1, des2, k=2)
    
    good_matches = []
    for m, n in matches:
        if m.distance < 0.75 * n.distance and m.distance < thresh:
            good_matches.append(m)
    
    return good_matches

def generate_match_visualization(img1: np.ndarray, img2: np.ndarray, 
                               p1: List, p2: List, 
                               matches: List) -> np.ndarray:
    return cv.drawMatches(
        img1, p1,
        img2, p2,
        matches, None,
        flags=cv.DrawMatchesFlags_NOT_DRAW_SINGLE_POINTS
    )

def generate_descriptors_single_image(img: np.ndarray, corners: np.ndarray, 
                                    is_fastr: bool=False) -> Tuple[List, np.ndarray]:
    img_gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    
    y, x = np.where(corners)
    
    keypoints = [cv.KeyPoint(float(x_), float(y_), 3.0) for x_, y_ in zip(x, y)]
    
    orb = cv.ORB_create(
        nfeatures=10000,
        scaleFactor=1.2,
        nlevels=8,
        edgeThreshold=31,
        firstLevel=0,
        WTA_K=2,
        patchSize=31,
        fastThreshold=20
    )
    
    _, descriptors = orb.compute(img_gray, keypoints)
    
    return keypoints, descriptors
