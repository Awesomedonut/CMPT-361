import cv2 as cv
import numpy as np

from fast_corner_detection import my_fastr_detector
from feature_matching import generate_descriptors_single_image

def get_homography(p1, p2):
    H, mask = cv.findHomography(p1, p2, cv.RANSAC, 
                                ransacReprojThreshold=5.0,
                                maxIters=2000,
                                confidence=0.995)

    return H, mask

def warp_imgs(img1, img2, H):
    h1, w1 = img1.shape[:2]
    h2, w2 = img2.shape[:2]
    
    corners_img2 = np.float32([[0,0], [0,h2], [w2,h2], [w2,0]]).reshape(-1,1,2)
    warped_corners_img2 = cv.perspectiveTransform(corners_img2, H)
    
    corners = np.concatenate((np.float32([[0,0], [0,h1], [w1,h1], [w1,0]]).reshape(-1,1,2), warped_corners_img2), axis=0)
    
    [xmin, ymin] = np.int32(corners.min(axis=0).ravel() - 0.5)
    [xmax, ymax] = np.int32(corners.max(axis=0).ravel() + 0.5)
    
    translation = [-xmin, -ymin]
    H_translation = np.array([[1, 0, translation[0]],
                              [0, 1, translation[1]],
                              [0, 0, 1]])
    
    result = cv.warpPerspective(img2, H_translation.dot(H), (xmax - xmin, ymax - ymin))
    
    result[translation[1]:h1+translation[1], translation[0]:w1+translation[0]] = img1
    
    return result

def create_panorama(img1, img2, p1, p2):
    gray1 = cv.cvtColor(img1, cv.COLOR_BGR2GRAY)
    gray2 = cv.cvtColor(img2, cv.COLOR_BGR2GRAY)
    
    freak = cv.xfeatures2d.FREAK_create()
    
    _, des1 = freak.compute(gray1, p1)
    _, des2 = freak.compute(gray2, p2)
    
    bf = cv.BFMatcher(cv.NORM_HAMMING)
    
    matches = bf.knnMatch(des1, des2, k=2)
    
    good_matches = []
    for pair in matches:
        if len(pair) < 2:
            continue
        m, n = pair
        if m.distance < 0.8 * n.distance:
            good_matches.append(m)
            
    print(f"num of goods: {len(good_matches)}")
    
    if len(good_matches) < 10:
        return None
        
    src_pts = np.float32([p1[m.queryIdx].pt for m in good_matches]).reshape(-1, 1, 2)
    dst_pts = np.float32([p2[m.trainIdx].pt for m in good_matches]).reshape(-1, 1, 2)
    
    H, mask = cv.findHomography(src_pts, dst_pts, cv.RANSAC, 
                               ransacReprojThreshold=5.0,
                               maxIters=2000,
                               confidence=0.995)
    
    if H is None:
        return None
    
    h1, w1 = img1.shape[:2]
    h2, w2 = img2.shape[:2]
    
    corners1 = np.float32([[0, 0], [0, h1], [w1, h1], [w1, 0]]).reshape(-1, 1, 2)
    corners2_transformed = cv.perspectiveTransform(corners1, H)
    
    corners = np.concatenate((
        np.float32([[0, 0], [0, h2], [w2, h2], [w2, 0]]).reshape(-1, 1, 2),
        corners2_transformed
    ))
    
    [xmin, ymin] = np.int32(corners.min(axis=0).ravel() - 0.5)
    [xmax, ymax] = np.int32(corners.max(axis=0).ravel() + 0.5)
    
    translation = np.array([
        [1, 0, -xmin],
        [0, 1, -ymin],
        [0, 0, 1]
    ])
    
    output_img = cv.warpPerspective(
        img1, 
        translation.dot(H),
        (xmax - xmin, ymax - ymin)
    )
    
    output_img[-ymin:h2-ymin, -xmin:w2-xmin] = img2
    
    return output_img

def compute_matched_points(p1, p2, des1, des2):
    bf = cv.BFMatcher()
    
    matches = bf.knnMatch(des1, des2, k=2)
    
    good_matches = []
    for m, n in matches:
        if m.distance < 0.8 * n.distance:
            good_matches.append(m)
    
    print(f"num of matches : {len(good_matches)}")
    
    if len(good_matches) < 10:
        return [], []
    
    matched_pts1 = []
    matched_pts2 = []
    for match in good_matches:
        matched_pts1.append(p1[match.queryIdx].pt)
        matched_pts2.append(p2[match.trainIdx].pt)
    
    return np.float32(matched_pts1), np.float32(matched_pts2)

def create_panorama_4_images(images, keypoints_list):
        
    pano_1_2 = create_panorama(images[0], images[1], keypoints_list[0], keypoints_list[1])
    if pano_1_2 is None:
        print("fail pano 1")
        return None
        
    pano_3_4 = create_panorama(images[2], images[3], keypoints_list[2], keypoints_list[3])
    if pano_3_4 is None:
        print("fail pano 2")
        return None
    
    pano_1_2_corners = my_fastr_detector(pano_1_2) == 255
    pano_3_4_corners = my_fastr_detector(pano_3_4) == 255
    
    pano_1_2_p, _ = generate_descriptors_single_image(pano_1_2, pano_1_2_corners, is_fastr=True)
    pano_3_4_p, _ = generate_descriptors_single_image(pano_3_4, pano_3_4_corners, is_fastr=True)
    
    final_pano = create_panorama(pano_1_2, pano_3_4, pano_1_2_p, pano_3_4_p)
    
    return final_pano
