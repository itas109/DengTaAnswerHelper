import json, re,os
from aip import AipOcr

# APPID AK SK
APP_ID = '10677120'
API_KEY = 'T3qGq9NxVySQZCCoE9pDumlm'
SECRET_KEY = 'Xvp0WVPI0VuXvF26i1KTv0Bck0zrGVvA '
image_file = "img/1.jpg"
answer_file = 'A.txt'

# 定义参数变量
options = {
    # 'detect_direction': 'false',
    # 'language_type': 'CHN_ENG',
    # 'probability':'true'
}


# 获取需要处理的图片，并裁剪
def get_file_content(filePath):
    with open(filePath, 'rb') as fp:
        # 图片裁剪 只处理答题区域
        return fp.read()


# 载入答案
def get_file_answer(answer_file_path):
    file_object = open(answer_file, 'rU')
    try:
        file_context = file_object.read()
    finally:
        file_object.close()
    return file_context

def pull_screenshot():
    os.system('adb shell screencap -p /sdcard/1.jpg')
    os.system('adb pull /sdcard/1.jpg ' + os.getcwd()+ "/img")

if __name__ == "__main__":
    # 1.载入答案
    anser_content = get_file_answer(answer_file)
    # print(anser_content)

    # 2.题库预处理 去除空格，中文标点符号转为英文
    # anser_content = anser_content.replace('\r', '')
    anser_content = anser_content.replace('\n', '')  # 去除换行
    anser_content = anser_content.replace(' ', '')  # 去除空格
    anser_content = anser_content.replace('、', '')  # 去除空格
    anser_content = anser_content.replace('(', '')
    anser_content = anser_content.replace(')', '')
    anser_content = anser_content.replace('，', '')
    anser_content = anser_content.replace('“', '')#中文引号左
    anser_content = anser_content.replace('”', '')#中文引号右
    anser_content = anser_content.replace('"', '')#英文引号
    anser_content = anser_content.replace('[', '')
    anser_content = anser_content.replace(']', '')
    anser_content = anser_content.replace(',', '')
    anser_content = anser_content.replace('。', '')
    anser_content = anser_content.replace('?', '')
    anser_content = anser_content.replace('？', '')

    print(anser_content)

    client = AipOcr(APP_ID, API_KEY, SECRET_KEY)

    # 截图并传到PC
    pull_screenshot()

    # 3.调用通用文字识别, 图片参数为本地图片
    result = client.basicGeneral(get_file_content(image_file), options)
    # print(json.dumps(result).decode("unicode-escape"))
    # print(result)

    # 4.解析json，拼接关键字：将ABCD答案拼接为关键字
    result_json_str = json.dumps(result, ensure_ascii=False)
    result_json = json.loads(result_json_str)
    print(result_json)

    select_list = []
    words_result = result_json["words_result"]
    for i in words_result:
        select_list.append(i["words"])
    print("OCR列表 ： ",select_list)

    # 5.提取答案关键词
    keylist = ""
    answer_lists = [] #答案列表
    index_tile = 0
    index_A = 0
    count = 0
    for i in select_list:
        #找到选题所在位置
        if(index_tile <= 0):
            index_tile = str(i).find("选题")
        count = count + 1

        #匹配模板
        if(len(i) == 1):
            pattern = '[ABCD]'
        else:
            pattern = '[ABCD][^\d]'

        if (re.search(pattern,str(i))):#正则匹配答案
            answer_lists.append(i)#载入答案

            if (i[0] == "A"):
                #答案的上一个元素是最后一行题目
                index_A = count
                keylist = select_list[index_A- 2]

            if (i[0] == "D"):
                break

    print("OCR答案列表",answer_lists)

    #删除单选题/多选题前面的数据
    if(index_tile == count):
        #提取真正的题干
        keylist = keylist[index_tile + 2 :]
    else:
        #将上一行数据加入提高识别精度
        keylist = select_list[index_A -3] + keylist
        index_tile2 = keylist.find("选题")
        if( index_tile2 >= 0):
            keylist = keylist[index_tile2 + 2:]

    #过滤标点符号
    keylist = keylist.replace('(', '')
    keylist = keylist.replace(')', '')
    keylist = keylist.replace('（', '')
    keylist = keylist.replace('）', '')
    keylist = keylist.replace( '，','')
    keylist = keylist.replace(',', '')
    keylist = keylist.replace('。', '')
    keylist = keylist.replace('“', '')
    keylist = keylist.replace('”', '')
    keylist = keylist.replace('"', '')
    keylist = keylist.replace('[', '')
    keylist = keylist.replace(']', '')
    keylist = keylist.replace('\n', '')
    keylist = keylist.replace(' ', '')
    keylist = keylist.replace('、', '')
    keylist = keylist.replace('?', '')
    keylist = keylist.replace('？', '')

    print("单选题/多选题索引 : ", index_tile)
    print("关键词位置 : " ,count)
    print("搜索关键字 : ",keylist)

    if(keylist == ""):
        print("OCR错误 ： 关键词为空")
    else:
        # 通过关键字搜索题库
        index = anser_content.find(keylist)

        if(index < 0):
            print("OOCR错误 ： 未找到答案")
        else:
            answer_index = anser_content.find("参考答案:", index)

            answer_end_index = re.search('\d', anser_content[answer_index:]).start()

            #打印题目及答案
            tile_answer_index = anser_content.find(keylist)
            tile_answer = anser_content[tile_answer_index: answer_index + answer_end_index]
            print(tile_answer)

            # 找到答案
            anser_list_flags = []
            answer_list = anser_content[answer_index + 5: answer_index + answer_end_index]
            for letter in answer_list:
                anser_list_flags.append(letter)

            print("\n答案：")

            for anser_list_flag in anser_list_flags:
                # print("anser_list_flag",anser_list_flag)
                for answer_list in answer_lists:
                    # print("answer_list", answer_list)
                    if(str(answer_list).find(anser_list_flag) >= 0 ):
                        index_1 = tile_answer.find(anser_list_flag)
                        if(anser_list_flag != "D"):
                            index_2 = index_1 + 1 +re.search("[ABCD]",tile_answer[index_1 + 1 :]).start()
                        else:
                            index_2 = index_1 + 1 + re.search("[参考答案]", tile_answer[index_1 + 1:]).start()
                        # print(index_1)
                        # print(index_2)
                        print(tile_answer[index_1:index_2])

            # 回填答案

            # 计数

            # 到达20？

            # 提示交卷

            # 自动交卷
