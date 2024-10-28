import cv2 as cv
import numpy as np
import time

def generate_descriptors(img1, img2, corners1, corners2, is_fastr=False):
    start_time = time.time()
    
    img1_gray = cv.cvtColor(img1, cv.COLOR_BGR2GRAY)
    img2_gray = cv.cvtColor(img2, cv.COLOR_BGR2GRAY)
    keypoints1, keypoints2 = get_points(corners1, corners2)
    descriptors1, descriptors2 = compute_descriptors(img1_gray, img2_gray, keypoints1, keypoints2)
    
    desc_time = time.time() - start_time
    print(f"{'FASTR' if is_fastr else 'FAST'} descriptor generation time: {desc_time:.4f} seconds")
    
    return keypoints1, keypoints2, descriptors1, descriptors2, desc_time

def match_features(img1, img2, keypoints1, keypoints2, descriptors1, descriptors2, is_fastr=False):
    start_time = time.time()
    
    matches = find_matches(descriptors1, descriptors2)
    match_img = generate_match_visualization(img1, img2, keypoints1, keypoints2, matches)
    
    match_time = time.time() - start_time
    print(f"{'FASTR' if is_fastr else 'FAST'} matching time: {match_time:.4f} seconds")
    
    return match_img, match_time

def get_points(corners1, corners2):
    y1, x1 = np.where(corners1)
    y2, x2 = np.where(corners2)
    
    p1 = [cv.KeyPoint(float(x), float(y), 3.0) for x, y in zip(x1, y1)]
    p2 = [cv.KeyPoint(float(x), float(y), 3.0) for x, y in zip(x2, y2)]
    
    return p1, p2

def compute_descriptors(img1_gray, img2_gray, p1, p2):
    orb = cv.ORB_create(nfeatures=100000) # limit features to 100k to prevent overflow
    
    _, des1 = orb.compute(img1_gray, p1)
    _, des2 = orb.compute(img2_gray, p2)
        
    return des1, des2

def find_matches(des1, des2, thresh=8):
    matcher = cv.BFMatcher(cv.NORM_HAMMING, crossCheck=True)
    matches = matcher.match(des1, des2)
    
    matches = sorted(matches, key=lambda x: x.distance)
    matches = [m for m in matches if m.distance < thresh]
    
    return matches

def generate_match_visualization(img1, img2, p1, p2, matches):
    return cv.drawMatches(
        img1, p1,
        img2, p2,
        matches, None,
        flags=cv.DrawMatchesFlags_NOT_DRAW_SINGLE_POINTS
    )
