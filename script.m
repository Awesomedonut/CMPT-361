% PART 1: TAKE TWO PHOTOS

HP = imread('IMG_1042.JPG'); 
LP = imread('IMG_1040.jpg');  

HP = imresize(rgb2gray(HP), [500, 500]);
LP = imresize(rgb2gray(LP), [500, 500]);

imwrite(HP, 'HP.png');
imwrite(LP, 'LP.png');




% PART 2: COMPUTE FREQUENCY REPRESENTATIONS

HP_fft = fftshift(fft2(HP));
LP_fft = fftshift(fft2(LP));

% Compute magnitude
HP_mag = log(1 + abs(HP_fft));
LP_mag = log(1 + abs(LP_fft));

% Normalize for better visualization
HP_mag = mat2gray(HP_mag);
LP_mag = mat2gray(LP_mag);

% Save frequency responses
imwrite(HP_mag, 'HP-freq.png');
imwrite(LP_mag, 'LP-freq.png');


% Define Sobel kernel (horizontal)
sobel_kernel = fspecial('sobel');

% Define Gaussian kernel
sigma = 2.5;
gaus_kernel = fspecial('gaussian', [11 11], sigma); % Adjust size as necessary

% Define DoG kernel
dog_kernel = conv2(sobel_kernel, gaus_kernel, 'same');

% Visualize kernels using surf
figure; surf(gaus_kernel); title('Gaussian Kernel');
saveas(gcf, 'gaus-surf.png');

figure; surf(dog_kernel); title('DoG Kernel');
saveas(gcf, 'dog-surf.png');


% Apply Gaussian filter in spatial domain
HP_gaus = imfilter(HP, gaus_kernel, 'replicate');
LP_gaus = imfilter(LP, gaus_kernel, 'replicate');

% Compute frequency domain representations
HP_gaus_fft = fftshift(fft2(HP_gaus));
LP_gaus_fft = fftshift(fft2(LP_gaus));

% Save filtered images and frequency responses
imwrite(HP_gaus, 'HP-filt.png');
imwrite(mat2gray(log(1 + abs(HP_gaus_fft))), 'HP-filt-freq.png');
imwrite(LP_gaus, 'LP-filt.png');
imwrite(mat2gray(log(1 + abs(LP_gaus_fft))), 'LP-filt-freq.png');



% Fourier transform of DoG kernel to size 500x500
dog_fft = fftshift(fft2(dog_kernel, 500, 500));

% Apply DoG filter in frequency domain
HP_dog_filt = ifft2(ifftshift(HP_fft .* dog_fft));
LP_dog_filt = ifft2(ifftshift(LP_fft .* dog_fft));

% Save images and frequency responses
imwrite(mat2gray(real(HP_dog_filt)), 'HP-dogfilt.png');
imwrite(mat2gray(log(1 + abs(fftshift(fft2(HP_dog_filt))))), 'HP-dogfilt-freq.png');
imwrite(mat2gray(real(LP_dog_filt)), 'LP-dogfilt.png');
imwrite(mat2gray(log(1 + abs(fftshift(fft2(LP_dog_filt))))), 'LP-dogfilt-freq.png');




% PART 4: ANTI-ALIASING

% Subsample images by half (1:2:end)
HP_sub2 = HP(1:2:end, 1:2:end);
LP_sub2 = LP(1:2:end, 1:2:end);

% Compute frequency domain representation for half subsampled images
HP_sub2_freq = fftshift(fft2(HP_sub2));
LP_sub2_freq = fftshift(fft2(LP_sub2));

% Save subsampled images and their frequency domain versions
imwrite(HP_sub2, 'HP-sub2.png');
imwrite(mat2gray(log(1 + abs(HP_sub2_freq))), 'HP-sub2-freq.png');

imwrite(LP_sub2, 'LP-sub2.png');
imwrite(mat2gray(log(1 + abs(LP_sub2_freq))), 'LP-sub2-freq.png');

% Subsample images by quarter (1:4:end)
HP_sub4 = HP(1:4:end, 1:4:end);
LP_sub4 = LP(1:4:end, 1:4:end);

% Compute frequency domain representation for quarter subsampled images
HP_sub4_freq = fftshift(fft2(HP_sub4));
LP_sub4_freq = fftshift(fft2(LP_sub4));

% Save quarter subsampled images and their frequency domain versions
imwrite(HP_sub4, 'HP-sub4.png');
imwrite(mat2gray(log(1 + abs(HP_sub4_freq))), 'HP-sub4-freq.png');

imwrite(LP_sub4, 'LP-sub4.png');
imwrite(mat2gray(log(1 + abs(LP_sub4_freq))), 'LP-sub4-freq.png');

% Define Gaussian kernels for anti-aliasing before subsampling
gaus_aa_half = fspecial('gaussian', [7, 7], 1.0);  % Half size anti-aliasing kernel
gaus_aa_quarter = fspecial('gaussian', [11, 11], 1.5); % Quarter size anti-aliasing kernel

% Apply anti-aliasing to HP before half subsampling
HP_aa_half = imfilter(HP, gaus_aa_half, 'replicate');
HP_sub2_aa = HP_aa_half(1:2:end, 1:2:end);

% Compute frequency domain representation for anti-aliased half subsampled image
HP_sub2_aa_freq = fftshift(fft2(HP_sub2_aa));

% Save anti-aliased half subsampled image and frequency domain version
imwrite(HP_sub2_aa, 'HP-sub2-aa.png');
imwrite(mat2gray(log(1 + abs(HP_sub2_aa_freq))), 'HP-sub2-aa-freq.png');

% Apply anti-aliasing to HP before quarter subsampling
HP_aa_quarter = imfilter(HP, gaus_aa_quarter, 'replicate');
HP_sub4_aa = HP_aa_quarter(1:4:end, 1:4:end);

% Compute frequency domain representation for anti-aliased quarter subsampled image
HP_sub4_aa_freq = fftshift(fft2(HP_sub4_aa));

% Save anti-aliased quarter subsampled image and frequency domain version
imwrite(HP_sub4_aa, 'HP-sub4-aa.png');
imwrite(mat2gray(log(1 + abs(HP_sub4_aa_freq))), 'HP-sub4-aa-freq.png');



% Optimal thresholds for HP (adjust based on your observations)
lowThreshHP = 0.1; 
highThreshHP = 0.2;

% Optimal thresholds for LP (adjust based on your observations)
lowThreshLP = 0.05;
highThreshLP = 0.15;

% Apply Canny Edge Detection with optimal thresholds for HP
HP_canny_optimal = edge(HP, 'Canny', [lowThreshHP, highThreshHP]);
imwrite(HP_canny_optimal, 'HP-canny-optimal.png');

% Apply Canny Edge Detection with varied thresholds for HP
HP_canny_lowlow = edge(HP, 'Canny', [max(0, lowThreshHP * 0.5), highThreshHP]); % Lower low threshold
imwrite(HP_canny_lowlow, 'HP-canny-lowlow.png');

HP_canny_highlow = edge(HP, 'Canny', [min(0.99, lowThreshHP * 1.5), highThreshHP]); % Higher low threshold but still < high threshold
imwrite(HP_canny_highlow, 'HP-canny-highlow.png');

HP_canny_lowhigh = edge(HP, 'Canny', [lowThreshHP, min(0.99, highThreshHP * 0.5 + lowThreshHP + 0.01)]); % Lower high threshold, ensure it’s above low
imwrite(HP_canny_lowhigh, 'HP-canny-lowhigh.png');

HP_canny_highhigh = edge(HP, 'Canny', [lowThreshHP, min(0.99, highThreshHP * 1.5)]); % Higher high threshold
imwrite(HP_canny_highhigh, 'HP-canny-highhigh.png');

% Apply Canny Edge Detection with optimal thresholds for LP
LP_canny_optimal = edge(LP, 'Canny', [lowThreshLP, highThreshLP]);
imwrite(LP_canny_optimal, 'LP-canny-optimal.png');

% Apply Canny Edge Detection with varied thresholds for LP
LP_canny_lowlow = edge(LP, 'Canny', [max(0, lowThreshLP * 0.5), highThreshLP]); % Lower low threshold
imwrite(LP_canny_lowlow, 'LP-canny-lowlow.png');

LP_canny_highlow = edge(LP, 'Canny', [min(0.99, lowThreshLP * 1.5), highThreshLP]); % Higher low threshold but still < high threshold
imwrite(LP_canny_highlow, 'LP-canny-highlow.png');

LP_canny_lowhigh = edge(LP, 'Canny', [lowThreshLP, min(0.99, highThreshLP * 0.5 + lowThreshLP + 0.01)]); % Lower high threshold, ensure it’s above low
imwrite(LP_canny_lowhigh, 'LP-canny-lowhigh.png');

LP_canny_highhigh = edge(LP, 'Canny', [lowThreshLP, min(0.99, highThreshLP * 1.5)]); % Higher high threshold
imwrite(LP_canny_highhigh, 'LP-canny-highhigh.png');
