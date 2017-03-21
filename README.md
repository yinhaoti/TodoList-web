# TodoList-web
This is a TodoList app based on Flask+Gunicorn+Nginx+Supervisor



# 开发日志

### Version 0.1
1. 添加badge计数功能

### Version 0.2
1. 实现ajax的add请求
2. 实现ajax的badge增加

### Version 0.2.1
2017-03-21
1. ajax版本独立
2. 数据库的created_time等修改数据类型为text
3. 修改format时间显示问题
4. 优化js语言结构
5. 最新的todo显示在最前面
6. ajax实现删除, 以及删除对于的badge图标修改

### 下一个版本:
1. 优先实现，表单todo的用户登录注册功能
    - 找到好看的登录注册等的header
2. ajax实现修改
3. ajax完成功能
    - 首先需要一个list记录完和未完成的todo_id
    - 随时记录状态，包括删除
    - 然后根据id排序，找到完成未完成的todo，应该放到哪个todo之前或者之后
4. ajax的登录注册弹框功能



