import cv2

# Read an image from a file
image = cv2.imread("IMG_1179.jpg")
cv2.imshow("image", image)
cv2.moveWindow("Image Window", 100, 100) 
# Display the image (requires a GUI)
cv2.imshow("Image Window", image)
cv2.waitKey(0)
cv2.destroyAllWindows()
