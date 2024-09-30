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
imwrite(HP_g, 'HP-filt.png'); % gauss filtered images
imwrite(LP_g, 'LP-filt.png');

HP_fg = fft2(HP_g); % frequency representation of gauss filtered images
LP_fg = fft2(LP_g); % same process as part 2, but on gauss filtered imgs
HP_fg = fftshift(HP_fg); 
LP_fg = fftshift(LP_fg);
HP_fg = abs(HP_fg) / 5; 
LP_fg = abs(LP_fg) / 5;
imwrite(HP_fg, 'HP-filt-freq.png'); % freq rep of gauss filtered imgs
imwrite(LP_fg, 'LP-filt-freq.png');

ft_d = fft2(dog, 500, 500); % fourier transform of DoG kernel, size 500x500
HP_fd = fft2(HP); 
LP_fd = fft2(LP);
HP_fd = HP_fd .* ft_d; % filtering using DoG kernel. 
                       % result is freq rep of DoG filtered imgs
LP_fd = LP_fd .* ft_d;

HP_d = ifft2(HP_fd); % inverse fourier transform, converting back to img
LP_d = ifft2(LP_fd); 
imwrite(HP_d, 'HP-dogfilt.png'); % DoG filtered imgs
imwrite(LP_d, 'LP-dogfilt.png');

HP_fd = fftshift(HP_fd); % shift freq rep of DoG 
LP_fd = fftshift(LP_fd);
HP_fd = abs(HP_fd) / 5; % taking magnitude and adjusting brightness of freq rep of DoG imgs
LP_fd = abs(LP_fd) / 5;
imwrite(HP_fd, 'HP-dogfilt-freq.png'); % freq rep of DoG filtered imgs
imwrite(LP_fd, 'LP-dogfilt-freq.png');



% 4: ANTI-ALIASING

HP_sub2 = HP(1:2:end, 1:2:end); %  subsample to half. step size 2
LP_sub2 = LP(1:2:end, 1:2:end); 
imwrite(HP_sub2, 'HP-sub2.png'); % subsampled img (spatial domain)
imwrite(LP_sub2, 'LP-sub2.png');

HP_sub2_freq = fftshift(fft2(HP_sub2)); % subsampled freq rep (freq domain)
LP_sub2_freq = fftshift(fft2(LP_sub2));
HP_sub2_freq = abs(HP_sub2_freq) / 70;
LP_sub2_freq = abs(LP_sub2_freq) / 70;
imwrite(HP_sub2_freq, 'HP-sub2-freq.png');
imwrite(LP_sub2_freq, 'LP-sub2-freq.png');

HP_sub4 = HP(1:4:end, 1:4:end); % subsample to quarter. step size 4
LP_sub4 = LP(1:4:end, 1:4:end);
imwrite(HP_sub4, 'HP-sub4.png'); % subsampled img (spatial domain)
imwrite(LP_sub4, 'LP-sub4.png');


HP_sub4_freq = fftshift(fft2(HP_sub4)); % subsampled freq rep (freq domain)
LP_sub4_freq = fftshift(fft2(LP_sub4));
HP_sub4_freq = abs(HP_sub4_freq) / 50;
LP_sub4_freq = abs(LP_sub4_freq) / 50;
imwrite(HP_sub4_freq, 'HP-sub4-freq.png');
imwrite(LP_sub4_freq, 'LP-sub4-freq.png');

hf_filt_2 = imgaussfilt(HP, 1.5); % anti-aliasing for half
                                  % standard deviation is 1.5
hf_filt_samp_2 = hf_filt_2(1:2:end, 1:2:end); %
hf_sub2_freq = abs(fftshift(fft2(hf_filt_samp_2))) / 20;
imwrite(hf_filt_samp_2, 'HP-sub2-aa.png');
imwrite(hf_sub2_freq, 'HP-sub2-aa-freq.png');

hf_filt_4 = imgaussfilt(HP, 3); % anti-aliasing for quarter. SD is 3
hf_filt_samp_4 = hf_filt_4(1:4:end, 1:4:end);
hf_sub4_freq = abs(fftshift(fft2(hf_filt_samp_4))) / 20;
imwrite(hf_filt_samp_4, 'HP-sub4-aa.png');
imwrite(hf_sub4_freq, 'HP-sub4-aa-freq.png');


%imshow([HP_sub2_freq LP_sub2_freq]);











% 
% 
% 
% imshow([HP LP])