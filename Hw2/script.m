% 1: Take four photograph pairs or sets of 4.

S2im1 = imresize(imread("IMG_1180.jpg"), [750 480]);
imwrite(S2im1, "S2-im1.png");

S2im2 = imresize(imread("IMG_1181.jpg"), [750 480]);
imwrite(S2im2, "S2-im2.png");

S3im1 = imresize(imread("IMG_1182.jpg"), [750 480]);
imwrite(S3im1, "S3-im1.png");

S3im2 = imresize(imread("IMG_1179.jpg"), [750 480]);
imwrite(S3im2, "S3-im2.png");



% 2: FAST feature detector
% 3: Point description and matching
% 4: RANSAC and Panoramas