require 'oci8'
require 'rspec/expectations'
require 'appium_lib'
require 'cucumber/ast'
require 'rubygems'
require 'selenium-webdriver'
require_relative 'app_executor'

class IosSimulator < SimulatorStratrgy
  include RSpec::Matchers

  def check_balance(account, op, amount)
    click_button("assert")
    #cases according to account type
    case 
    when account == '"胜达通钱包"'
      #Two ways converting string to operator
      #  1:
      #    operator = ['+', '-', '*', '/']
      #    operator.map {|o| 2.public_send o,2 }
      #    => [4, 0, 4, 1]
      #  2:
      #    operator = ['+', '-', '*', '/']
      #    operator.map {|o| 2.method(o).(2) }
      #    => [4, 0, 4, 1]
      expectedWalletBalance = @myWalletBalance[1, @myWalletBalance.length].to_f.method(op).(amount.to_f)
      #get actuall Wallet balance value
      actualWalletBalance = find_element(:xpath,  "//UIAApplication[1]/" + uia_window_adapter + "/UIAScrollView[1]/UIAWebView[1]/UIAStaticText[2]").attribute("name")
      #convert value type
      actualWalletBalance = actualWalletBalance[1, actualWalletBalance.length].to_f
      #print results
      puts "胜达通钱包账户："
      puts "实际余额为： " + actualWalletBalance.to_s 
      puts "期望余额为： " + expectedWalletBalance.to_s
      expectedWalletBalance.should eq(actualWalletBalance)
    when account == '"意如宝"'
      expectedFundBalance = @myFundBalance.to_f.method(op).(amount.to_f)
      actualFundBalance = find_element(:xpath,  "//UIAApplication[1]/" + uia_window_adapter + "/UIAScrollView[1]/UIAWebView[1]/UIAStaticText[16]").attribute("name").to_f
      #print results
      puts "意如宝总资产："
      puts "实际总资产金额为： " + actualFundBalance.to_s 
      puts "期望总资产金额为： " + expectedFundBalance.to_s
      expectedFundBalance.should eq(actualFundBalance)
    when account == '"招财3号"'
      expectedZhaocaiBalance = @myZhaocaiBalance.to_f.method(op).(amount.to_f)
      actualZhaocaiBalance = find_element(:xpath,  "//UIAApplication[1]/" + uia_window_adapter + "/UIAScrollView[1]/UIAWebView[1]/UIAStaticText[8]").attribute("name").to_f
      #print results
      puts "招财3号账户："
      puts "实际总资产金额为： " + actualZhaocaiBalance.to_s 
      puts "期望总资产金额为： " + expectedZhaocaiBalance.to_s
      expectedZhaocaiBalance.should eq(actualZhaocaiBalance)
    end
  end

  def click_login 
    # Push message setting dialog is not available in iOS7.1 init window
    if $caps[:caps][:platformVersion] >= "8.1"
      find_element(:name, "OK").click
    end
    click_button("assert")
    #find_element(:name, "手机账号登录").click
    find_element(:name, "使用其他手机号登录 >>").click
  end

  def client_features(page)
    case 
    when page == "交易记录"
      click_button("assert")  
      # find_element(:xpath, "//UIAStaticText[@name='交易记录']").click
      # Click UIAStaticText is not work here. 
      # So we have to calulate the center point xy value of the icon.
      txtX = find_element(:xpath, "//UIAStaticText[@name='交易记录']").location.x
      txtY = find_element(:xpath, "//UIAStaticText[@name='交易记录']").location.y
      txtH = find_element(:xpath, "//UIAStaticText[@name='交易记录']").size.height
      txtW = find_element(:xpath, "//UIAStaticText[@name='交易记录']").size.width
      Appium::TouchAction.new.tap(x: txtX+txtW/2, y: txtY-txtW).perform
      buyLogCnt = find_elements(:xpath, "//UIAStaticText[@name='购买成功']").length
      sellLogCnt = find_elements(:xpath, "//UIAStaticText[@name='赎回成功']").length
      puts "恭喜发财的交易记录中有" + buyLogCnt.to_s + "个购买交易记录。"
      puts "恭喜发财的交易记录中有" + sellLogCnt.to_s + "个赎回交易记录。"
      (buyLogCnt+sellLogCnt).should > 0
    when page == "消息"
      click_button("messages")
      msgCnt = find_elements(:xpath, "//UIAStaticText").length / 3
      puts "恭喜发财中有" + msgCnt.to_s + "个我的消息。"
      msgCnt.should >= 1
    when page == "常见问题"
      click_button("more")
      find_element(:xpath, "//UIAStaticText[@name='常见问题']").click
      faqLinksCnt = find_elements(:xpath, "//UIALink").length
      puts "恭喜发财中有" + (faqLinksCnt/2).to_s + "个常见问题链接。"
      faqLinksCnt.should >= 10
    when page == "产品列表"
      click_button("products list")
      available_products = find_elements(:xpath, "//UIAStaticText[@name='购买']").length
      puts "恭喜发财中有" + available_products.to_s + "个产品显示可以购买。"
      available_products.should >= 1
    end
  end

  def enter_payment_pswd_next(pswd)
    enter_payment_pswd(pswd)
    # Click next on bank card buy page
    if find_element(:xpath, "//UIAApplication[1]/" + uia_window_adapter + "/UIAStaticText[1]").attribute("name") == "借记卡快捷支付"
      find_element(:xpath, "//UIAStaticText[@name='确 认 支 付']").click
    end 
    # Click next on wallet buy page
    if find_element(:xpath, "//UIAApplication[1]/" + uia_window_adapter + "/UIAStaticText[1]").attribute("name") == "胜达通钱包支付"
      find_element(:xpath, "//UIAStaticText[@name='确 认 支 付']").click
    end
    # Click next on sell page
    if find_element(:xpath, "//UIAApplication[1]/" + uia_window_adapter + "/UIAStaticText[1]").attribute("name") == "赎回"
      find_element(:xpath, "//UIAStaticText[@name='确认赎回']").click
    end 
  end

  def enter_phone_code(bankpswd)
    # Click 获取验证码 button
    find_element(:xpath, "//UIAButton[@name='获取验证码']").click
    # Waiting system generate the code
    # puts "Wait 10 seconds for generating the verification code."
    sleep 10
    # Get code from Oracle DB
    oci = OCI8.new('tester_rw', 'GT9njvzb2Z', '//10.132.81.162:1521/sndapay')
    oci.exec('select  CAPTCHA from maslog.captcha_log where CREATE_TIME = (select max(create_time) from maslog.captcha_log )')  do  |pcode|
      # Puts "Phone verification code is: " + pcode.to_s[2, 6]
      find_element(:xpath, "//UIATextField[@value='银行手机验证码']").click
      find_element(:xpath, "//UIATextField[@value='银行手机验证码']").send_keys pcode.to_s[2, 6]
    end
    if bankpswd == "和银行卡密码"
      find_element(:xpath, "//UIASecureTextField[@value='请输入银行取款密码']").click
      find_element(:xpath, "//UIAButton[@name='1']").click
      find_element(:xpath, "//UIAButton[@name='2']").click
      find_element(:xpath, "//UIAButton[@name='3']").click
      find_element(:xpath, "//UIAButton[@name='4']").click
      find_element(:xpath, "//UIAButton[@name='5']").click
      find_element(:xpath, "//UIAButton[@name='6']").click
      find_element(:xpath, "//UIAButton[@name='确认']").click
    end
  end

  def enter_sms_code
    # Click 获取验证码 button
    find_element(:xpath, "//UIAButton[@name='获取验证码']").click
    # Waiting system generate the code
    # puts "Wait 10 seconds for generating the verification code."
    sleep 10
    # Get code from Oracle DB
    oci = OCI8.new('tester_rw', 'GT9njvzb2Z', '//10.132.81.162:1521/sndapay')
      oci.exec('select  CAPTCHA from maslog.captcha_log where CREATE_TIME = (select max(create_time) from maslog.captcha_log )')  do  |pcode|
      #Puts "Phone verification code is: " + pcode.to_s[2, 6]
      find_element(:xpath, "//UIATextField[@value='短信验证码']").click
      find_element(:xpath, "//UIATextField[@value='短信验证码']").send_keys pcode.to_s[2, 6]
    end
  end

  def get_balance
    #get RuYiBao fund current account balance
    @myFundBalance = find_element(:xpath, "//UIAApplication[1]/" + uia_window_adapter + "/UIAScrollView[1]/UIAWebView[1]/UIAStaticText[16]").attribute("name")
    puts "当前意如宝账户总资产为：" + @myFundBalance
    #get Shengpay wallet current account balance
    @myWalletBalance = find_element(:xpath, "//UIAApplication[1]/" + uia_window_adapter + "/UIAScrollView[1]/UIAWebView[1]/UIAStaticText[2]").attribute("name")
    puts "当前胜达通钱包余额为：" + @myWalletBalance
    #get Shengpay wallet current account balance
    @myZhaocaiBalance = find_element(:xpath, "//UIAApplication[1]/" + uia_window_adapter + "/UIAScrollView[1]/UIAWebView[1]/UIAStaticText[8]").attribute("name")
    puts "当前招财3号账户总资产为：" + @myZhaocaiBalance
  end 
  
  def login_name_next(username)
    find_element(:xpath, "//UIATextField[@value='请输入登录的手机号']").send_keys username
    find_element(:name, "下一步").click
  end

  def login_psw_next(pswd)
    #Enter password 
    find_element(:xpath, "//UIASecureTextField[@value='请输入胜达通登录密码']").click
    find_element(:xpath, "//UIASecureTextField[@value='请输入胜达通登录密码']").send_keys pswd
    find_element(:name, "登录").click
  end

  def return_receipt(oper)
    sleepcnt = MAX_SLEEP_SECS
    case 
    when oper == '"购买"'
      while (sleepcnt > 0) and (find_element(:xpath, "//UIAApplication[1]/" + uia_window_adapter + "/UIAScrollView[1]/UIAWebView[1]/UIAStaticText[2]").attribute("name") != "购买申请已提交")  do
        sleep 1
        puts "等待" + (MAX_SLEEP_SECS - sleepcnt).to_s + "秒。"
        sleepcnt -= 1
      end
      wait_until_displayed("//UIAStaticText[@name='购买申请已提交']")
      #Click return
      find_element(:xpath, "//UIAStaticText[@name='返回']").click
    when oper == '"赎回"'
      while (sleepcnt > 0) and !(find_element(:xpath, "//UIAApplication[1]/" + uia_window_adapter + "/UIAScrollView[1]/UIAWebView[1]/UIAStaticText[2]").attribute("name").include? "赎回")  do
        sleep 1
        puts "等待" + (MAX_SLEEP_SECS - sleepcnt).to_s + "秒。"
        sleepcnt -= 1
      end
      #Click return 
      find_element(:xpath, "//UIAStaticText[@name='返 回']").click
    end
  end


  def ruyibao_transaction(channel, oper, amount)
    click_button("assert")
    
    case
    when oper == '"购买"'
      #click buy
      find_element(:xpath, "//UIAStaticText[@name='购买']").click
      #Click amount text field to enable the soft keyboard
      find_element(:xpath, "//UIATextField[@value='请填写购买金额']").click
      #Enter purchase the amount 
      find_element(:xpath, "//UIATextField[@value='请填写购买金额']").send_keys amount
      #Click next 
      find_element(:xpath, "//UIAStaticText[@name='下一步']").click

      # Select channel
      case 
      when channel == '"胜达通钱包"'
        #Select Shengpay wallet  
        find_element(:xpath, "//UIAStaticText[@name='胜达通钱包支付']").click
      when channel == '"民生银行卡7891"'
        #Select CMBC card
        find_element(:xpath, "//UIAStaticText[@name='民生银行']").click
      end
      # Click next 
      find_element(:xpath, "//UIAStaticText[@name='下一步']").click
    when oper == '"赎回"'
      # Click sell
      find_element(:xpath, "//UIAStaticText[@name='赎回']").click
      # Select Channel
      case 
      when channel == '"胜达通钱包"' 
        find_element(:xpath, "//UIAStaticText[@name='胜达通钱包']").click
        #Enter sell the amount 
        find_element(:xpath, "//UIATextField[@value='请输入赎回金额']").click
        find_element(:xpath, "//UIATextField[@value='请输入赎回金额']").send_keys amount

      when channel == '"民生银行卡7891"'
        find_element(:xpath, "//UIAStaticText[@name='民生银行']").click
        #Enter sell the amount 
        find_element(:xpath, "//UIATextField[@value='请输入赎回金额']").click
        find_element(:xpath, "//UIATextField[@value='请输入赎回金额']").send_keys amount
      end
    end
    
  end

  def skip_guesture
    find_element(:name, "跳过").click
    find_element(:name, "确定").click
    #iOS 7.1 Xpath click 确定
    #find_element(:xpath, "//UIAApplication[1]/UIAWindow[3]/UIAAlert[1]/UIATableView[2]/UIATableCell[1]").click
    #iOS 8.3 Xpath click 确定
    #find_element(:xpath, "//UIAApplication[1]/UIAWindow[5]/UIAAlert[1]/UIACollectionView[1]/UIACollectionCell[2]/UIAButton[1]").click
  end 

  def start_app
    # Make sure you have started appium server 
    current_context = "WEBVIEW_1"
  end

  def zhaocai3_transaction(channel, oper, amount)
    click_button("products_list")
  
    case
    when oper == '"购买"'
      # Find ZhaoCai3# product and click buy under it
      # If the buy button's point y value is greate than ZhaoCai3#'s point y value
      # then click it and break.
      
      # Need extra waiting time until webview load finished
      wait = Selenium::WebDriver::Wait.new :timeout => 20
      wait.until { find_elements(:xpath, "//UIAStaticText[contains(@name, '本服务由胜达通提供')]").length >= 1 }
      
      # Click @Buy@ button under ZhaoCai3# item
      itemPointY = find_element(:xpath, "//UIAStaticText[@name='招财3号']").location.y
      find_elements(:xpath, "//UIAStaticText[@name='购买']").each do  |element|
        buyPointY = element.location.y
        if (buyPointY > itemPointY) 
          element.click
          break
        end
      end

      #Click amount text field to enable the soft keyboard
      find_element(:xpath, "//UIATextField[contains(@value,'请填写购买金额')]").click
      #Enter purchase the amount 
      find_element(:xpath, "//UIATextField[contains(@value,'请填写购买金额')]").send_keys amount
      #Click next 
      find_element(:xpath, "//UIAStaticText[@name='下一步']").click

      # Select channel
      case 
      when channel == '"胜达通钱包"'
        #Select Shengpay wallet  
        find_element(:xpath, "//UIAStaticText[@name='胜达通钱包支付']").click
      when channel == '"民生银行卡7891"'
        #Select CMBC card
        find_element(:xpath, "//UIAStaticText[@name='民生银行']").click
      end

      # Click next 
      find_element(:xpath, "//UIAStaticText[@name='下一步']").click
    when oper == "赎回"
      # Sell ZhaoCai3# is not available now.
    end
  end 

  private 
  def click_button(btn)
    btnIndex = "8"
    imgIndex = "5"
    case 
     when btn == "products list"
       btnIndex = "8"
       imgIndex = "5"
     when btn == "assert"
       btnIndex = "9"
       imgIndex = "6"
     when btn == "messages"
       btnIndex = "10"
       imgIndex = "7"
     when btn == "more"
       btnIndex = "11"
       imgIndex = "9"
    end 
    # Change the context
    current_context = "NATIVE_APP"
    # Click "My Assert" button is slightly different between iOS versions. 
    if $caps[:caps][:platformVersion] >= "8.1"
      # UIAImage name is changed from "assert.png" to "assert_tap.png" after login.
      # So it is not possible to locate it by name
      wait_until_displayed("//UIAApplication[1]/" + uia_window_adapter + "/UIAImage[" + imgIndex + "]")
      find_element(:xpath, "//UIAApplication[1]/" + uia_window_adapter + "/UIAImage[" + imgIndex + "]").click
    elsif $caps[:caps][:platformVersion] == "7.1"
      wait_until_displayed("//UIAApplication[1]/UIAWindow[1]/UIAButton[" + btnIndex + "]")
      find_element(:xpath, "//UIAApplication[1]/UIAWindow[1]/UIAButton[" + btnIndex + "]").click
    end
    current_context = "WEBVIEW_1"
  end

  def enter_payment_pswd(pswd)
    #Enter password 
    find_element(:xpath, "//UIASecureTextField[@value='请输入胜达通支付密码']").click
    find_element(:xpath, "//UIASecureTextField[@value='请输入胜达通支付密码']").send_keys pswd

  end

  def rescue_exceptions
    begin
      yield
    rescue Selenium::WebDriver::Error::NoSuchElementError
      retry
    end
  end

  def uia_window_adapter
    windowPath = "UIAWindow[1]"
    if $caps[:caps][:deviceName] == "iPhone 6" || $caps[:caps][:deviceName] == "iPhone 6 Plus"
      windowPath = "UIAWindow[2]"
    end
    return windowPath
  end

  def wait_until_displayed(locator)
    rescue_exceptions { find_element(:xpath, locator).displayed? }
  end

end