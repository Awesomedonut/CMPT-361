import cv2 as cv
import numpy as np

from utils import read_and_resize_image, my_fast_detector


def main():
    # 1: Take 3 sets of 2 photographs to be stitched together to create a panorama
    photo_sets = {
        "IMG_1180.jpg": "S2-im1.png",
        "IMG_1181.jpg": "S2-im2.png",
        "IMG_1182.jpg": "S3-im1.png",
        "IMG_1179.jpg": "S3-im2.png"
    }

    for photo_path, img_name in photo_sets.items():
        read_and_resize_image(photo_path, img_name)
    
    # 2: FAST feature detector
    imgs_for_fast_detection = {
        "S1-im1.png": "S1-fast.png",
        "S2-im1.png": "S2-fast.png"
    }
    
    for input_path, output in imgs_for_fast_detection.items():
        img = cv.imread(input_path)
        cv.imwrite(output, my_fast_detector(img))
        print(f"imwrite to {output}")


main()
