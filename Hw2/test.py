import cv2 as cv
from panorama import create_panorama
left_img = cv.imread('S1-im1.png')
right_img = cv.imread('S1-im2.png')
result_img = create_panorama(left_img, right_img, is_fastr=True)
result_img2 = create_panorama(left_img, right_img, is_fastr=False)
cv.imwrite('result_fastr2.jpg', result_img)
cv.imwrite('result_non_fastr2.jpg', result_img2)
