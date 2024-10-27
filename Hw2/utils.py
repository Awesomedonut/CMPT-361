import cv2 as cv
import numpy as np

# values from FAST wikipedia page
THRESHOLD = 0.08
N = 12
# high-speed test points: example pixels 1, 9, 5, 13
high_speed_pixels = [(0, 3), (0, -3), (-3, 0), (3, 0)]

def read_and_resize_image(img_path, img_name, size = (480, 750)): # size = (width, height)
    img = cv.imread(img_path)
    resized_img = cv.resize(img, size, interpolation=cv.INTER_AREA)
    cv.imwrite(img_name, resized_img)
    print(f"imwrite to {img_name}")

def my_fast_detector(img):
    img_gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    img_gray = convert_img_to_normalized_float(img_gray)
    
    brights, darks = initialize_detection_matrices(img_gray)
    corners = detect_initial_corners(img_gray, brights, darks)
    corners = detect_refined_corners(img_gray, brights, darks, corners)
    corners = create_corner_overlay(img_gray, corners)
    
    return corners

def convert_img_to_normalized_float(img): # this is the same as im2double since float is 64-bit in python
    return img.astype(float) / 255.0

def initialize_detection_matrices(img_gray):
    brights = np.zeros_like(img_gray, dtype=float)
    darks = np.zeros_like(img_gray, dtype=float)
    return brights, darks

def detect_initial_corners(img_gray, brights, darks):
    for dx, dy in high_speed_pixels:
        shifted_img = np.roll(np.roll(img_gray, dx, axis=0), dy, axis=1)
        brights += (shifted_img > (img_gray + THRESHOLD)).astype(float)
        darks += (shifted_img < (img_gray - THRESHOLD)).astype(float)
    
    return (brights + darks) >= 1

def detect_refined_corners(img_gray, brights, darks, possible_corners):
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

def create_corner_overlay(img_gray, corners):
    overlay = (img_gray * 255).astype(np.uint8)
    overlay[corners] = 255
    return overlay
