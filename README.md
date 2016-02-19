# OneCucumber
OneCucumber is a automation test framework for APPs developed by PhoneGap. 
ONE Cucumber gherkin script will work on both of your iOS and Android APPs, so it is named as "OneCucumber".

Main Features:

1. Test scripts Android and iOS dual-platform support.
2. Under-test APP UI element objects repository support.
3. Oracle access interface support
4. Chinese language support

###Installation
Install ruby
    https://www.ruby-lang.org/en/downloads/
    
Install Cucumber
```
gem install cucumber
```

Download OneCucumber code:
```
git clone https://github.com/lannyzhujin/OneCucumber.git
```

Execute commands in peoject's root directory ：
```
cucumber -p nubia-5_0
cucumber -p iphone6sp-9_0
cucumber features/ios_client.feature -p iphone6sp-9_0
```


# OneCucumber
OneCucumber 是面向由PhoneGap开发APP的自动化测试框架。
由于该框架支持一套cucumber用例同时覆盖android和iOS两种平台，故名“OneCucumber”。

主要特性：

1. 测试脚本Android和iOS双平台支持。
2. 被测App界面元素对象库支持。
3. 提供Oracle数据库访问接口。
4. 测试脚本中文支持。

###安装：
 - 安装ruby环境：
    https://www.ruby-lang.org/zh_cn/downloads/
    
 - 安装Cucumber环境：
```
gem install cucumber
```

 - 安装Appium,并启动appium server：
```
appium &
```
   或者点击Appium应用程序中的[Lauch]按钮

 - 安装AndroidSDK
参考http://developer.android.com/sdk/installing/index.html?pkg=tools 

 - 连接Android真机或者模拟器
    执行如下命令，可以看到通过USB端口连接的android真机或者已经启动成功的模拟器的deviceNmae
```
 adb devices
```
 
 - 安装xcode中的iOS模拟器
   > 模拟器安装：安装完成Xcode以后，创建一个新项目进入Xcode主界面，通过菜单[Xcode]-[Preferences…]进入参数设置，选择Downloads页面，下载需要使用的模拟器iOS版本。
   > 启动模拟器：可以通过Xcode主菜单、ctrl+点击Xcode dock图标等多种方式启动模拟器

 - 下载OneCucumber源码：
```
git clone https://github.com/lannyzhujin/OneCucumber.git
```

 - 修改appium.txt中的配置
   > 修改被测应用安装包的.apk或者.app路径
     如将OneCucumber/features/support/nubia-5_0/appium.txt文件中app的配置修改为
     app = "/Users/yourusername/Downloads/zcjb-yy.apk"
     将OneCucumber/features/support/iphone6s-9_0/appium.txt文件中app的配置修改为
     app = "/Users/yourusername/Downloads/zcjb-yy.app"
   > android版本需要修改对应device name
     如将OneCucumber/features/support/nubia-5_0/appium.txt文件中deviceName的配置修改为
     deviceName = "NX505J"

 - 在项目根目录中执行用例,例如：
```
cucumber -p nubia-5_0
cucumber -p iphone6s-9_0
cucumber features/ios_client.feature -p iphone6s-9_0
```
