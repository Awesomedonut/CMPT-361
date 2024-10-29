import cv2 as cv
from panorama import create_panorama
left_img = cv.imread('IMG_1236.jpg')
right_img = cv.imread('IMG_1237.jpg')
result_img = create_panorama(left_img, right_img, is_fastr=True)
# result_img2 = create_panorama(left_img, right_img, is_fastr=False)
cv.imwrite('gokuuuuu.jpg', result_img)
# cv.imwrite('result_non_fastr3.jpg', result_img2)
