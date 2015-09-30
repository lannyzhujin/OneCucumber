# This file provides setup and common functionality across all features.  It's
# included first before every test run, and the methods provided here can be 
# used in any of the step definitions used in a test.  This is a great place to
# put shared data like the location of your app, the capabilities you want to
# test with, and the setup of selenium.

require 'rspec/expectations'
require 'appium_lib'
require 'cucumber/ast'
require 'rubygems'
require 'selenium-webdriver'
require '/Users/yourusername/workspace/MobileAutomation/mobileautomation/AppGap/features/step_definitions/ios_simulator'

MAX_SLEEP_SECS = 30
MAXWAITSECONDS = 30
ORACLE_ADDRESS = '//oracle.sdptest.shengpay.com:1521/sndapay'

# Create a custom World class so we don't pollute `Object` with Appium methods
class AppiumWorld
end

# Load the desired configuration from appium.txt, create a driver then
# Add the methods to the world
$caps = Appium.load_appium_txt file: File.expand_path("./../"+ENV['IDEVICENAME']+"/appium.txt", __FILE__), verbose: true

# Cucumber method World()
World do
  AppiumWorld.new
end

Before { 
  if $caps[:caps][:platformName] == "ios"
    Appium::Driver.new($caps)
    Appium.promote_appium_methods IosSimulator
    $executor = AppExecutor.new(IosSimulator.new)
  else
    Appium::Driver.new($caps)
    Appium.promote_appium_methods AndroidSimulator
    $executor = AppExecutor.new(AndroidSimulator.new)
  end
  $driver.start_driver 
  $driver.set_wait 60
}
After { 
  $driver.driver_quit 
}
