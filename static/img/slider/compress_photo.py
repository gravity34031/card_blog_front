import time
start_time = time.time()

from PIL import Image
import os

IMAGES_LIST = []
OLD_IMAGE_SIZES = []
IMAGE_SIZES = []
dir_path = 'C:/Users/gravi/OneDrive/Рабочий стол/site/frontend/card_blog/static/img/slider/'

for (dirpath, dirnames, filenames) in os.walk(dir_path):
    IMAGES_LIST.extend(filenames)
    break
print(IMAGES_LIST)


def change_image_quality(img, img_path, quality):
    print(f'ФУНКЦИЯ{quality}')
    img.save(img_path, quality=quality)

for file_name in IMAGES_LIST:
    print(file_name)
    if file_name.split('.')[1] == 'webp':
        continue
    #file_name = '16731143176239196143920990013005.jpg'

    img_path = dir_path + file_name
    new_img_path = dir_path + \
        file_name.split('.')[0] + '_compressed' + '.webp'
    print(img_path)
    img = Image.open(img_path)

    
    OLD_IMAGE_SIZES.append(os.path.getsize(img_path) / 1024)
    print(img.mode)

    
    # check alpha
    img.save(new_img_path)
    

    IMAGE_SIZES.append(os.path.getsize(new_img_path) / 1024)
    img.close()


print("--- %s seconds ---" % (time.time() - start_time))
for i in range(len(OLD_IMAGE_SIZES)):
    print(f'{OLD_IMAGE_SIZES[i]} --> {IMAGE_SIZES[i]}')
