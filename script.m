% Yan Jin Song, student number 301470175

% PART 1: TAKE TWO PHOTOS

HP = imread('IMG_1042.JPG'); 
LP = imread('IMG_1040.jpg');  

HP = im2double(HP); % convert image to double
LP = im2double(LP);

HP = imresize(HP, [500, 500]); % resize and crop to 500x500
LP = imresize(LP, [500, 500]);

HP = rgb2gray(HP); % convert to grayscale
LP = rgb2gray(LP);

imwrite(HP, 'HP.png'); % save images as HP.png and LP.png respectively
imwrite(LP, 'LP.png');



% PART 2: COMPUTE FREQUENCY REPRESENTATIONS

HP_freq = fft2(HP); % take fast fourier transform for both images
LP_freq = fft2(LP);

HP_freq = fftshift(HP_freq); % shift so we can visualize freq components better
LP_freq = fftshift(LP_freq);

HP_freq = abs(HP_freq) / 90; % take magnitude of complex numbers and adjust brightness
LP_freq = abs(LP_freq) / 90;

imwrite(HP_freq, 'HP-freq.png');
imwrite(LP_freq, 'LP-freq.png');


% PART 3: VISUALIZE KERNELS

sobel = [-1 0 1; -2 0 2; -1 0 1]; % define sobel and gaussian kernels
gaus = fspecial('gaussian', 10, 2.5);
dog = conv2(gaus, sobel); % use those 2 to define drivative of gaussian kernel

surf(gaus); % surf visualizations of Gauss and DoG kernels
saveas(gcf, 'gaus-surf.png');
surf(dog);
saveas(gcf, 'dog-surf.png');

HP_g = imfilter(HP, gaus); % filtering using gauss
LP_g = imfilter(LP, gaus);
imwrite(HP_g, 'HP-filt.png');
imwrite(HP_g, 'LP-filt.png');

HP_fg = fft2(HP_g); % frequency representation of gauss filtered images
LP_fg = fft2(LP_g); % same process as part 2, but on gauss filtered imgs
HP_fg = fftshift(HP_fg); 
LP_fg = fftshift(LP_fg);
HP_fg = abs(HP_fg) / 5; 
LP_fg = abs(LP_fg) / 5;
imwrite(HP_fg, 'HP-filt-freq.png');
imwrite(LP_fg, 'LP-filt-freq.png');

imshow([HP_fg LP_fg])





% 
% 
% 
% imshow([HP LP])