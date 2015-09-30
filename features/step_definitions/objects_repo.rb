# encoding: utf-8
#
app_prefix = "//android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/"
btn_prefix = "android.widget.LinearLayout[1]/android.widget.LinearLayout[1]/android.widget.RelativeLayout[1]/android.widget.LinearLayout[1]/"
balance_prefix = "android.widget.LinearLayout[1]/android.webkit.WebView[1]/android.webkit.WebView[1]/"
$objects_repo = {
    btn_product_list:    app_prefix+btn_prefix+"android.widget.LinearLayout[1]/android.widget.CheckBox[1]",
    btn_asset:           app_prefix+btn_prefix+"android.widget.LinearLayout[2]/android.widget.CheckBox[1]",
    btn_message:         app_prefix+btn_prefix+"android.widget.LinearLayout[3]/android.widget.RelativeLayout[1]/android.widget.CheckBox[1]",
    btn_more:            app_prefix+btn_prefix+"android.widget.LinearLayout[4]/android.widget.CheckBox[1]",
    btn_trans_log:       app_prefix+"android.widget.LinearLayout[1]/android.webkit.WebView[1]/android.webkit.WebView[1]/android.widget.ListView[1]/android.view.View[2]/android.view.View[1]",
    edt_login_pwd:       app_prefix+"/android.widget.ScrollView[1]/android.widget.LinearLayout[1]/android.widget.RelativeLayout[1]/android.widget.EditText[1]",
    btn_login_mobile:    "手机账号登录",
    edt_phone_num:       "请输入登录的手机号",
    btn_next:            "下一步",
    btn_login:           "登录",
    btn_skip:            "跳过",
    btn_ok:              "确定",
    btn_buy:             "购买",
    btn_sell:            "赎回",
    link_faq:            "常见问题",
    buy_log:             "//*[contains(@content-desc,'购买')]",
    sell_log:            "//*[contains(@content-desc,'赎回')]",
    faq:                 "//*[contains(@content-desc,'介绍')]",
    ruyibao_balance:     app_prefix+balance_prefix+"android.view.View[1]/android.view.View[10]",
    wallet_balance:      app_prefix+balance_prefix+"android.widget.ListView[1]/android.view.View[1]/android.view.View[3]",
    zhaocai_balance:     app_prefix+balance_prefix+"android.view.View[1]/android.view.View[3]",
    receipt_title:       app_prefix+balance_prefix+"android.view.View[2]/android.view.View[1]",
    confirm_pay_title:   "//android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.LinearLayout[1]/android.widget.RelativeLayout[1]/android.widget.TextView[1]",
    edt_pwd:             "//android.widget.EditText",
    btn_vrf_code:        "获取验证码",
    edt_vrf_code:        "//android.widget.EditText",
    btn_confirm_pay:     "确 认 支 付",
    btn_confirm_sell:    "确认赎回",
    btn_return:          "返回",
    btn_return_1:        "返 回",
    edt_amount:          "//android.widget.EditText",
    btn_sdp_walllet:     "//*[starts-with(@content-desc, '胜达通钱包')]",
    btn_cmbc:            "//*[starts-with(@content-desc, '民生银行')]",

}
