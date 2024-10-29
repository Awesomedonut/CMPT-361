import cv2 as cv
import numpy as np
from typing import Tuple

def read_and_resize_image(img_path: str, img_name: str, size: Tuple[int, int]=(480, 750)) -> None:
    img = cv.imread(img_path)
    resized_img = cv.resize(img, size, interpolation=cv.INTER_AREA)
    cv.imwrite(img_name, resized_img)
    print(f"imwrite to {img_name}")

def convert_img_to_normalized_float(img: np.ndarray) -> np.ndarray:
    return img.astype(float) / 255.0
