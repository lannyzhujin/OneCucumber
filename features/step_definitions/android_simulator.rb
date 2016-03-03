# Uncomment next line if you want oracle connection
#require 'oci8'
require 'rspec'
require_relative 'app_executor'

class AndroidSimulator < SimulatorStratrgy
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
      actualWalletBalance = find_element(:xpath,  $objects_repo[:wallet_balance]).attribute("name")
      #convert value type
      actualWalletBalance = actualWalletBalance[1, actualWalletBalance.length].to_f
      #print results
      puts "胜达通钱包账户："
      puts "实际余额为： " + actualWalletBalance.to_s 
      puts "期望余额为： " + expectedWalletBalance.to_s
      expectedWalletBalance.should eq(actualWalletBalance)
    when account == '"意如宝"'
      expectedFundBalance = @myFundBalance.to_f.method(op).(amount.to_f)
      actualFundBalance = find_element(:xpath,  $objects_repo[:ruyibao_balance]).attribute("name").to_f
      #print results
      puts "意如宝总资产："
      puts "实际总资产金额为： " + actualFundBalance.to_s 
      puts "期望总资产金额为： " + expectedFundBalance.to_s
      expectedFundBalance.should eq(actualFundBalance)
    end
  end

  def click_login
    click_button("assert")
    find_element(:name, $objects_repo[:btn_login_mobile]).click
  end

  def client_features(page)
    case 
    when page == "交易记录"
      # Go to trans log page
      click_button("assert")  
      find_element(:xpath, $objects_repo[:btn_trans_log]).click
      # Get the trans log
      buyLogCnt  = find_elements(:xpath, $objects_repo[:buy_log]).length
      sellLogCnt = find_elements(:xpath, $objects_repo[:sell_log]).length
      puts "恭喜发财的交易记录中有" + buyLogCnt.to_s + "个购买交易记录。"
      puts "恭喜发财的交易记录中有" + sellLogCnt.to_s + "个赎回交易记录。"
      # Check the trans log numbers
      (buyLogCnt+sellLogCnt).should > 0
    when page == "消息"
      # Go to message page
      click_button("messages")
      # Get my messages
      msgCnt = find_elements(:xpath, $objects_repo[:buy_log]).length
      msgCnt += find_elements(:xpath, $objects_repo[:sell_log]).length
      puts "恭喜发财中约有" + msgCnt.to_s + "个我的消息。"
      # Check the message numbers
      msgCnt.should be >= 0
    when page == "常见问题"
      # Go to FAQ page
      click_button("more")
      find_element(:name, $objects_repo[:link_faq]).click
      # Get FAQ links
      faqLinksCnt = find_elements(:xpath, $objects_repo[:faq]).length
      puts "恭喜发财中约有" + faqLinksCnt.to_s + "个FAQ常见问题链接。"
      # Check FAQ numbers
      faqLinksCnt.should be >= 0
    when page == "产品列表"
      # Go to products list
      click_button("products list")
      # Get available product list
      available_products = find_elements(:name, $objects_repo[:btn_buy]).length
      puts "恭喜发财中有" + available_products.to_s + "个产品显示可以购买。"
      # Check available product number
      available_products.should be >= 1
    end
  end

  def enter_payment_pswd_next(pswd)
    enter_payment_pswd(pswd)
    page_title = find_element(:xpath, $objects_repo[:confirm_pay_title]).attribute("text")
    # Click next on bank card buy page
    if page_title == "借记卡快捷支付"
      find_element(:name, $objects_repo[:btn_confirm_pay]).click
    end 
    # Click next on wallet buy page
    if page_title == "胜达通钱包支付"
      find_element(:name, $objects_repo[:btn_confirm_pay]).click
    end 
    # Click next on sell page
    if page_title == "赎回"
      find_element(:name, $objects_repo[:btn_confirm_sell]).click
    end 
  end

  def enter_phone_code(bankpswd)
    # Click 获取验证码 button
    find_element(:name, $objects_repo[:btn_vrf_code]).click
    # Waiting system generate the code
    # puts "Wait 10 seconds for generating the verification code."
    sleep 10
    # Get code from Oracle DB
    oci = OCI8.new('tester_rw', 'GT9njvzb2Z', ORACLE_ADDRESS)
    oci.exec('select  CAPTCHA from maslog.captcha_log where CREATE_TIME = (select max(create_time) from maslog.captcha_log )')  do  |pcode|
      # Puts "Phone verification code is: " + pcode.to_s[2, 6]
      # input 银行手机验证码
      find_element(:xpath, $objects_repo[:edt_vrf_code]).click
      find_element(:xpath, $objects_repo[:edt_vrf_code]).send_keys pcode.to_s[2, 6]
    end
  end

  def enter_sms_code
    # Click 获取验证码 button
    find_element(:name, $objects_repo[:btn_vrf_code]).click
    # Waiting system generate the code
    # puts "Wait 10 seconds for generating the verification code."
    sleep 10
    # Get code from Oracle DB
    oci = OCI8.new('tester_rw', 'GT9njvzb2Z', ORACLE_ADDRESS)
    oci.exec('select  CAPTCHA from maslog.captcha_log where CREATE_TIME = (select max(create_time) from maslog.captcha_log )')  do  |pcode|
      #Puts "Phone verification code is: " + pcode.to_s[2, 6]
      find_element(:xpath, $objects_repo[:edt_vrf_code]).click
      find_element(:xpath, $objects_repo[:edt_vrf_code]).send_keys pcode.to_s[2, 6]
    end
  end

  def get_balance
    #get RuYiBao fund current account balance
    @myFundBalance = find_element(:xpath, $objects_repo[:ruyibao_balance]).attribute("name")
    puts "当前意如宝账户总资产为：" + @myFundBalance
    #get Shengpay wallet current account balance
    @myWalletBalance = find_element(:xpath, $objects_repo[:wallet_balance]).attribute("name")
    puts "当前胜达通钱包余额为：" + @myWalletBalance
    #get Shengpay wallet current account balance
    @myZhaocaiBalance = find_element(:xpath, $objects_repo[:zhaocai_balance]).attribute("name")
    puts "当前招财3号账户总资产为：" + @myZhaocaiBalance
  end 
  
  def login_name_next(username)
    find_element(:name, $objects_repo[:edt_phone_num]).send_keys username
    find_element(:name, $objects_repo[:btn_next]).click
  end

  def login_psw_next(pswd)
    #Enter password 
    find_element(:xpath, $objects_repo[:edt_login_pwd]).click
    find_element(:xpath, $objects_repo[:edt_login_pwd]).send_keys pswd
    find_element(:name, $objects_repo[:btn_login]).click
  end

  def skip_guesture
    #find_element(:xpath, $objects_repo[:btn_skip]).click
    find_element(:name, $objects_repo[:btn_skip]).click
    find_element(:name, $objects_repo[:btn_ok]).click
  end 

  def return_receipt(oper)
    sleepcnt = MAX_SLEEP_SECS
    case 
    when oper == '"购买"'
      while (sleepcnt > 0) and (find_element(:xpath, $objects_repo[:receipt_title]).attribute("name") != "购买申请已提交")  do
        sleep 1
        puts "等待" + (MAX_SLEEP_SECS - sleepcnt).to_s + "秒。"
        sleepcnt -= 1
      end
      #wait_until_displayed("购买申请已提交")
      #Click return
      find_element(:name, $objects_repo[:btn_return]).click
    when oper == '"赎回"'
      while (sleepcnt > 0) and !(find_element(:xpath, $objects_repo[:receipt_title]).attribute("name").include? "赎回")  do
        sleep 1
        puts "等待" + (MAX_SLEEP_SECS - sleepcnt).to_s + "秒。"
        sleepcnt -= 1
      end
      #wait_until_displayed("赎回成功")
      #Click return 
      find_element(:name, $objects_repo[:btn_return_1]).click
    end
  end

  def ruyibao_transaction(channel, oper, amount)
    click_button("assert")
  
    case
    when oper == '"购买"'
      #click buy
      find_element(:name, $objects_repo[:btn_buy]).click
      #Click amount text field to enable the soft keyboard
      #find_element(:name, "请填写购买金额").click
      find_element(:xpath, $objects_repo[:edt_amount])
      #Enter purchase the amount 
      #find_element(:name, "请填写购买金额").send_keys amount
      find_element(:xpath, $objects_repo[:edt_amount]).send_keys amount
      #Click next 
      find_element(:name, $objects_repo[:btn_next]).click

      # Select channel
      case 
      when channel == '"胜达通钱包"'
        #Select Shengpay wallet  
        find_element(:xpath, $objects_repo[:btn_sdp_walllet]).click
      when channel == '"民生银行卡7891"'
        #Select CMBC card
        find_element(:xpath, $objects_repo[:btn_cmbc]).click
      end
      # Click next 
      find_element(:name, $objects_repo[:btn_next]).click
    when oper == '"赎回"'
      # Click sell
      find_element(:name, $objects_repo[:btn_sell]).click
      # Select Channel
      case 
      when channel == '"胜达通钱包"' 
        find_element(:xpath, $objects_repo[:btn_sdp_walllet]).click
        #Enter sell the amount 
        #find_element(:name, "请输入赎回金额").click
        #find_element(:name, "请输入赎回金额").send_keys amount
        find_elements(:xpath, $objects_repo[:edt_amount]).first.send_keys amount

      when channel == '"民生银行卡7891"'
        find_element(:xpath, $objects_repo[:btn_cmbc]).click
        #Enter sell the amount 
        #find_element(:name, "请输入赎回金额").click
        #find_element(:name, "请输入赎回金额").send_keys amount
        find_elements(:xpath, $objects_repo[:edt_amount]).first.send_keys amount
      end
    end
  end

  def start_app
    # Make sure you have started appium server 
    # puts available_contexts
    # set_context("NATIVE_APP")
    # puts $driver.class
  end

  def zhaocai3_transaction(channel, oper, amount)
    raise NotImplementedError, "zhaocai3_transaction case is not Implemented in Android version"
  end 

  private
  def click_button(btn)
    case 
     when btn == "products list"
      find_element(:xpath, $objects_repo[:btn_product_list])
      find_element(:xpath, $objects_repo[:btn_product_list]).click
     when btn == "assert"
      find_element(:xpath, $objects_repo[:btn_asset])
      find_element(:xpath, $objects_repo[:btn_asset]).click
     when btn == "messages"
      find_element(:xpath, $objects_repo[:btn_message])
      find_element(:xpath, $objects_repo[:btn_message]).click
     when btn == "more"
      find_element(:xpath, $objects_repo[:btn_more])
      find_element(:xpath, $objects_repo[:btn_more]).click
    end 
  end

  def enter_payment_pswd(pswd)
      # Enter password 
      find_elements(:xpath, $objects_repo[:edt_pwd]).last.click
      find_elements(:xpath, $objects_repo[:edt_pwd]).last.send_keys pswd
      # Hide the keyboard in case of mistyping.
      hide_keyboard()

  end
end
