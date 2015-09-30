# encoding: utf-8


当(/^用户以用户名"(.*?)"和密码"(.*?)"登录$/) do |usrnm, pswd|
  steps %{
    当点击登陆按钮
    并且输入用户名"#{usrnm}"后点击下一步
    并且输入登陆密码"#{pswd}"后点击下一步
  }
  if $caps[:caps][:platformName] == "android"
    steps %{并且跳过手势设置}
  end
end

假设(/^Appium启动恭喜发财APP以后$/) do
  $executor.start_app
end
 
当(/^点击登陆按钮$/) do
  $executor.click_login
end
 
并且(/^输入用户名"(.*?)"后点击下一步$/) do |username|
  $executor.login_name_next(username)
end

并且(/^输入登陆密码"(.*?)"后点击下一步$/) do |pswd|
  $executor.login_psw_next(pswd)
end

并且(/^跳过手势设置$/) do
  $executor.skip_guesture
end

那么(/^在我的财富页面上可以看到我的钱包余额和我的资产金额$/) do 
  $executor.get_balance
end

并且(/^输入短信验证码$/)  do 
  $executor.enter_sms_code
end

并且(/^输入手机验证码(.*?)$/)  do  |bankpswd|
  $executor.enter_phone_code(bankpswd)
end

同时(/^输入支付密码"(.*?)"后点击下一步$/)  do  |pswd|
  $executor.enter_payment_pswd_next(pswd)
end

那么(/^返回(".*?")收据$/)  do  |oper|
  $executor.return_receipt(oper)
end

并且(/^检查(".*?")余额 ([+-]) (\d+) 人民币$/)  do  |account, op, amount|
  $executor.check_balance(account, op, amount)
end

当(/^使用(".*?")(".*?")(\d+)元人民币的意如宝产品$/)  do  |channel, oper, amount|
  $executor.ruyibao_transaction(channel, oper, amount)
end

那么(/^APP应该可以显示"(.*?)"$/) do |page|
  $executor.client_features(page)
end
