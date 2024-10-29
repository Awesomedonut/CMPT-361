import cv2 as cv
from panorama import create_panorama
left_img = cv.imread('S1-im1.png')
right_img = cv.imread('S1-im2.png')
result_img = create_panorama(right_img, left_img, use_fastr=True)
result_img2 = create_panorama(right_img, left_img, use_fastr=False)
cv.imwrite('result9.jpg', result_img)
cv.imwrite('result10.jpg', result_img2)
