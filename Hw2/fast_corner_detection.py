import cv2 as cv
import numpy as np
from typing import Tuple
from image_processing import convert_img_to_normalized_float

# values from FAST wikipedia page
THRESHOLD = 0.08
N = 12
# high-speed test points: example pixels 1, 9, 5, 13
high_speed_pixels = [(0, 3), (0, -3), (-3, 0), (3, 0)]

# harris constants
K = 0.04
H_THRESH = 0.005

def my_fast_detector(img: np.ndarray) -> np.ndarray:
    img_gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    img_gray = convert_img_to_normalized_float(img_gray)
    
    brights, darks = initialize_matrices(img_gray)
    corners = detect_initial_corners(img_gray, brights, darks)
    corners = detect_other_corners(img_gray, brights, darks, corners)
    corners = create_corner_overlay(img_gray, corners)
    
    return corners

def initialize_matrices(img_gray: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
    brights = np.zeros_like(img_gray, dtype=float) # creates matrix of zeroes
    darks = np.zeros_like(img_gray, dtype=float)
    return brights, darks

def detect_initial_corners(img_gray: np.ndarray, brights: np.ndarray, 
                         darks: np.ndarray) -> np.ndarray:
    for dx, dy in high_speed_pixels:
        shifted_img = np.roll(np.roll(img_gray, dx, axis=0), dy, axis=1)
        brights += (shifted_img > (img_gray + THRESHOLD)).astype(float)
        darks += (shifted_img < (img_gray - THRESHOLD)).astype(float)
    
    return (brights + darks) >= 1

def detect_other_corners(img_gray: np.ndarray, brights: np.ndarray, 
                        darks: np.ndarray, possible_corners: np.ndarray) -> np.ndarray:
    # remaining points that aren't high-speed test points
    remaining_points = [
        (-3, 1), (-2, 2), (-1, 3),
        (-1, -3), (-2, -2), (-3, -1),
        (1, 3), (2, 2), (3, 1),
        (1, -3), (3, -1), (2, -2)
    ]
    
    for dx, dy in remaining_points:
        shifted_img = np.roll(np.roll(img_gray, dx, axis=0), dy, axis=1)
        mask = possible_corners & (shifted_img > (img_gray + THRESHOLD))
        brights += mask.astype(float)
        mask = possible_corners & (shifted_img < (img_gray - THRESHOLD))
        darks += mask.astype(float)
    
    return (brights >= N) | (darks >= N)

def create_corner_overlay(img_gray: np.ndarray, corners: np.ndarray) -> np.ndarray:
    overlay = (img_gray * 255).astype(np.uint8)  # convert to int so it's compatible with original image
    overlay[corners] = 255
    return overlay

def my_fastr_detector(img: np.ndarray) -> np.ndarray:
    img_gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    img_gray = convert_img_to_normalized_float(img_gray)
    
    brights, darks = initialize_matrices(img_gray)
    corners = detect_initial_corners(img_gray, brights, darks)
    corners = detect_other_corners(img_gray, brights, darks, corners)
    
    corner_mask = apply_harris_measure(img_gray, corners)
    corners = create_corner_overlay(img_gray, corner_mask)
    return corners

def apply_harris_measure(img_gray: np.ndarray, fast_corners: np.ndarray) -> np.ndarray:
    dx = calculate_x_derivative(img_gray)
    dy = calculate_y_derivative(img_gray)
    
    dx2, dy2, dxy = multiply_components(dx, dy)
    dx2, dy2, dxy = apply_gaussian_blurring(dx2, dy2, dxy)
    harris_response = calculate_harris_response(dx2, dy2, dxy)
    harris_response = mask_non_corner_responses(harris_response, fast_corners)
    
    return harris_response > H_THRESH

def calculate_x_derivative(img: np.ndarray) -> np.ndarray:
    return cv.Sobel(img, cv.CV_64F, 1, 0, ksize=3)

def calculate_y_derivative(img: np.ndarray) -> np.ndarray: 
    return cv.Sobel(img, cv.CV_64F, 0, 1, ksize=3)

def multiply_components(dx: np.ndarray, dy: np.ndarray) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    return dx * dx, dy * dy, dx * dy

def apply_gaussian_blurring(dx2: np.ndarray, dy2: np.ndarray, 
                          dxy: np.ndarray) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    window_size = 3
    dx2 = cv.GaussianBlur(dx2, (window_size, window_size), 0)
    dy2 = cv.GaussianBlur(dy2, (window_size, window_size), 0)
    dxy = cv.GaussianBlur(dxy, (window_size, window_size), 0)
    return dx2, dy2, dxy

def calculate_harris_response(dx2: np.ndarray, dy2: np.ndarray, 
                            dxy: np.ndarray) -> np.ndarray:
    det = (dx2 * dy2) - (dxy * dxy)    # det(M) = A*B - C^2
    trace = dx2 + dy2                   # trace(M) = A + B
    return det - K * trace              # R = det(M) - k*trace(M)

def mask_non_corner_responses(harris_response: np.ndarray, 
                            fast_corners: np.ndarray) -> np.ndarray:
    harris_response[~fast_corners] = 0 # ~ operator is negation
    return harris_response

