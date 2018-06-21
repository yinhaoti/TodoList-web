# 指定基础image
FROM yinhaoti/python-dev-base
MAINTAINER yinhaotian hautienyin@qq.com

# initDocker 是文件 initDocker/ 是文件夹
ADD ./requirements.txt /yinhaotian/initDocker/
ADD ./data/nltk_data /root/nltk_data
WORKDIR /yinhaotian/wtf_chat_robot/

# gensim 需要 先安装 numpy 和 scipy，否则会报错
# 先安装 numpy 和 scipy
RUN pip3 install numpy scipy -i https://pypi.tuna.tsinghua.edu.cn/simple
RUN pip install -r /yinhaotian/initDocker/requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple/

CMD "echo" "wtf_chat_robot docker build sucess!"

# 用来指定端口，使容器内的应用可以通过端口和外界交互。
# EXPOSE 8080

# docker build -t yinhaoti/chatbot .
# 即删即用
# docker run --rm -it -v $(pwd):/yinhaotian/wtf_chat_robot/ --name chatbot yinhaoti/chatbot /bin/bash
# 自动重启/后台运行
# docker run -d --restart=always -v $(pwd):/yinhaotian/wtf_chat_robot/ --name chatbot yinhaoti/chatbot /bin/bash -c 'python3 -u ./WSGI_Debian_wechat.py'
# 查看输出日志
# docker logs -f chatbot



