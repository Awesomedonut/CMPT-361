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

function overlay = my_fast_detector(img)
    img = im2double(img);
    if size(img, 3) == 3
        img = rgb2gray(img);
    end

    % threshold and N values from 
    % https://en.wikipedia.org/wiki/Features_from_accelerated_segment_test

    threshold = 0.08;
    N = 12;

    % will examine example pixels 1, 9, 5, and 13 (also from same wiki
    % page, High-speed_test section
    
    high_speed_first = [0, 3; 0, -3]; % 1 and 9
    high_speed_next= [-3, 0; 3, 0]; % 5 and 13
    % remaining 12 points in the 16 point circle
    remaining_points = [-3, 1; -2, 2; -1, 3; -1, -3; -2, -2; -3, -1; 1, 3; 2, 2; 3, 1; 1, -3; 3, -1; 2, -2;];

    brights = zeros(size(img));
    darks = zeros(size(img));

    for i = 1:2
        shifted_img = circshift(img, high_speed_first(i, :));
        brights = brights + (shifted_img > img + threshold);
        darks = darks + (shifted_img < img - threshold);
    end
    
    possible_corners = (brights + darks) >= 1;

    for i = 1:2
        shifted_img = circshift(img, high_speed_next(i, :));
        brights(possible_corners) = brights(possible_corners) + ...
            (shifted_img(possible_corners) > img(possible_corners) + threshold);
        darks(possible_corners) = darks(possible_corners) + ...
            (shifted_img(possible_corners) < img(possible_corners) - threshold);
    end
    
    for i = 1:size(remaining_points, 1)
        shifted_img = circshift(img, remaining_points(i, :));
        brights(possible_corners) = brights(possible_corners) + ...
            (shifted_img(possible_corners) > img(possible_corners) + threshold);
        darks(possible_corners) = darks(possible_corners) + ...
            (shifted_img(possible_corners) < img(possible_corners) - threshold);
    end
    
    corners = (brights >= N) | (darks >= N);
    
    overlay = img; 
    overlay(corners) = 1;

end

S1fast = my_fast_detector(imread("S1-im1.png"));
imwrite(S1fast, "S1-fast.png");

S2fast = my_fast_detector(imread("S2-im1.png"));
imwrite(S2fast, "S2-fast.png");

% 2: Robust FAST using Harris Cornerness metric

% 3: Point description and matching
% 4: RANSAC and Panoramas