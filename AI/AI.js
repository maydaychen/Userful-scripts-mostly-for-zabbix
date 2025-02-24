
// Need 3 parameters
// 1. alert_subject -> {TRIGGER.NAME}
// 2. api_key -> sk-xxxx
// 3. model -> deepseek-v3
var DeepSeek = {
    params: {},
    setParams: function (params) {
        if (typeof params !== 'object') {
            return;
        }
        DeepSeek.params = params;
        if (typeof DeepSeek.params.api_key !== 'string' || DeepSeek.params.api_key === '') {
            throw 'API key for DeepSeek is required.';
        }
        DeepSeek.params.url = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
    },
    request: function (data) {
        if (!DeepSeek.params.api_key) {
            throw 'API key is missing.';
        }
        var request = new HttpRequest();
        request.addHeader('Content-Type: application/json');
        request.addHeader('Authorization: Bearer ' + DeepSeek.params.api_key);

        var response = request.post(DeepSeek.params.url, JSON.stringify(data));

        if (request.getStatus() < 200 || request.getStatus() >= 300) {
            throw 'DeepSeek API request failed with status code ' + request.getStatus() + '.';
        }

        try {
            response = JSON.parse(response);
        } catch (error) {
            Zabbix.log(4, '[ DeepSeek Webhook ] Failed to parse response.');
            response = null;
        }
        return response;
    }
};

try {
    var params = JSON.parse(value),
        data = {},
        result = "",
        required_params = ['alert_subject'];

    Object.keys(params).forEach(function (key) {
        if (required_params.indexOf(key) !== -1 && params[key] === '') {
            throw 'Parameter "' + key + '" cannot be empty.';
        }
    });

    data = {
        "model":params.model,
        "messages": [
            {
                "role": "user",
                "content": "Alert : " + params.alert_subject + " occurred on Zabbix. " +
                    "Suggest possible causes and solutions to resolve this issue. " +
                    "Provide concise points (10 lines max) including root causes, debug commands, and mitigation steps."
            }
        ]
    };

    DeepSeek.setParams({api_key: params.api_key});
    Zabbix.log(3, '[ DeepSeek debug ] ' + data);
    var response = DeepSeek.request(data);

    // 修改点3: 解析 DeepSeek 响应结构
    if (response && response.choices && response.choices.length > 0) {
        result = response.choices[0].message.content.trim();
    } else {
        throw 'No valid response from DeepSeek.';
    }

    return result;

} catch (error) {
    Zabbix.log(3, '[ DeepSeek Webhook ] ERROR: ' + error);
    throw 'Sending failed: ' + error;
}