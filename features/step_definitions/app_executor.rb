require 'rspec'

class AppExecutor
  attr_accessor :simulator
  def initialize(simStrgy)
    @simulator = simStrgy 
  end  

  def check_balance(account, op, amount)
    @simulator.check_balance(account, op, amount)
  end
  
  def click_login
    @simulator.click_login
  end

  def client_features(page)
    @simulator.client_features(page)
  end
 
  def login_name_next(username)
    @simulator.login_name_next(username)
  end

  def login_psw_next(pswd)
    @simulator.login_psw_next(pswd)
  end

  def skip_guesture
    @simulator.skip_guesture
  end

  def get_balance
    @simulator.get_balance
  end

  def enter_sms_code
    @simulator.enter_sms_code
  end

  def enter_phone_code(bankpswd)
    @simulator.enter_phone_code(bankpswd)
  end

  def enter_payment_pswd_next(pswd)
    @simulator.enter_payment_pswd_next(pswd)
  end

  def return_receipt(oper)
    @simulator.return_receipt(oper)
  end

  def start_app
    @simulator.start_app
  end
  
  def ruyibao_transaction(channel, oper, amount)
    @simulator.ruyibao_transaction(channel, oper, amount)
  end

  def zhaocai3_transaction(channel, oper, amount)
    @simulator.zhaocai3_transaction(channel, oper, amount)
  end 

end

# Super class or interface of AndroidSimulator and IosSimulator
class SimulatorStratrgy
  attr_accessor :myFundBalance, :myWalletBalance, :myZhaocaiBalance

  def initialize
    @myFundBalance = 0
    @myWalletBalance = 0
    @myZhaocaiBalance = 0
  end
  
  # "Abstract" method definition here. 
  # Just raise a NotImplementedError exception.
  def login
    raise NotImplementedError, "Implement this method in a child class"
  end
  
end

# Disable the 'expect' sytax
# Use 'should' sytax to evaluate the test result
# For example: actualValue.should eq(expectedValue) 
RSpec.configure do |config|
  config.expect_with :rspec do |c|
    # Disable the `expect` sytax...
    c.syntax = :should
  end
end

class WaitUntilDisplayed

  def rescue_exceptions
    begin
      yield
    rescue Selenium::WebDriver::Error::NoSuchElementError
      retry
    end
  end

  def wait_until_displayed(locator)
    rescue_exceptions { find_element(:xpath, locator).displayed? }
  end
end