// 接口地址
const brandsApiUrl = 'https://api.goldprice.fun/brandsApiUrl';
const domesticGoldApiUrl = 'https://api.goldprice.fun/domesticGoldApiUrl';

// 用于存储数据的变量
let brandsData = null;
let domesticGoldData = null;

// 更新金店品牌表格的函数
function updateBrandsTable(jsonData) {
    const tableBody = document.getElementById('brandsTable');
    tableBody.innerHTML = ''; // 清空现有的表格数据
    if (jsonData['brand']) {
        jsonData['brand'].forEach(item => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = item['title'];
            row.insertCell().textContent = item['gold'] + " 元/克";
            row.insertCell().textContent = item['platinum'] + " 元/克";
            row.insertCell().textContent = item['date'];
        });
    }
}

// 更新国内金价表格的函数
function updateDomesticGoldTable(jsonData) {
    const tableBody = document.getElementById('domesticGoldTable');
    tableBody.innerHTML = ''; // 清空现有的表格数据
    if (jsonData['gn']) {
        jsonData['gn'].forEach(item => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = item['title'];
            // 填充金额，并根据涨跌幅设置颜色
            let priceChangeClass = '';
            if (item['changepercent'] > 0) {
                priceChangeClass = 'increase';
            } else if (item['changepercent'] < 0) {
                priceChangeClass = 'decrease';
            }
            const priceCell = row.insertCell();
            priceCell.textContent = item['price'] + " 元/克";
            priceCell.className = priceChangeClass;
            // 填充涨跌幅
            const changeCell = row.insertCell();
            changeCell.textContent = item['changepercent'] + " %";
            changeCell.className = priceChangeClass; // 涨跌幅颜色与金额颜色一致

            row.insertCell().textContent = item['maxprice'] + " 元/克";
            row.insertCell().textContent = item['minprice'] + " 元/克";
            row.insertCell().textContent = item['openingprice'] + " 元/克";
            row.insertCell().textContent = item['lastclosingprice'] + " 元/克";
            row.insertCell().textContent = item['date'];
        });
    }
}

// 更新国际金价表格的函数
function updateInternationalGoldTable(jsonData) {
    const tableBody = document.getElementById('internationalGoldTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // 清空现有的表格数据
    if (jsonData['gj']) {
        jsonData['gj'].forEach(item => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = item['title'];

            const priceCell = row.insertCell();
            priceCell.textContent = item['price'];
            if (item['changepercent'].includes('+')) {
                priceCell.className = 'increase';
            } else {
                priceCell.className = 'decrease';
            }

            const changeCell = row.insertCell();
            changeCell.textContent = item['changepercent'];
            if (item['changepercent'].includes('+')) {
                changeCell.className = 'increase';
            } else {
                changeCell.className = 'decrease';
            }
            row.insertCell().textContent = item['maxprice'];
            row.insertCell().textContent = item['minprice'];
            row.insertCell().textContent = item['openingprice'];
            row.insertCell().textContent = item['lastclosingprice'];
            row.insertCell().textContent = item['date'];
        });
    }
}

// 更新香港金价表格的函数
function updateHongKongGoldTable(jsonData) {
    const tableBody = document.getElementById('hongKongGoldTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // 清空现有的表格数据
    if (jsonData['hk']) {
        jsonData['hk'].forEach(item => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = item['title'];
            row.insertCell().textContent = item['openingprice'];
            row.insertCell().textContent = item['lastclosingprice'];
            row.insertCell().textContent = item['maxprice'];
            row.insertCell().textContent = item['minprice'];
            row.insertCell().textContent = item['date'];
        });
    }
}

// 更新银行金价表格的函数
function updateBankGoldTable(jsonData) {
    const tableBody = document.getElementById('bankGoldTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // 清空现有的表格数据
    if (jsonData['yh']) {
        jsonData['yh'].forEach(item => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = item['title'];
            row.insertCell().textContent = item['midprice'];
            row.insertCell().textContent = item['buyprice'];
            row.insertCell().textContent = item['sellprice'];
            row.insertCell().textContent = item['maxprice'];
            row.insertCell().textContent = item['minprice'];
            row.insertCell().textContent = item['date'];
        });
    }
}

// 打开指定标签的函数
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("table-container");
    if (tabName != "Home") {
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
            document.getElementById("conversionTool").style.display = "none";
        }
    } else {
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "block";
            document.getElementById("conversionTool").style.display = "block";
        }
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// 页面加载完成后立即获取数据
window.onload = function() {
    // 获取金店品牌数据
    fetch(brandsApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(jsonData => {
            brandsData = jsonData;
            updateBrandsTable(jsonData);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });

    // 获取国内金价数据
    fetch(domesticGoldApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(jsonData => {
            domesticGoldData = jsonData;
            updateDomesticGoldTable(jsonData);

            // 从国内金价数据中获取黄金延期的价格和涨跌幅，并显示在首页
            const daygoldItem = jsonData['gn'].find(item => item['dir'] === 'daygold');
            if (daygoldItem) {
                const currentPrice = parseFloat(daygoldItem['price']);
                const changePercent = parseFloat(daygoldItem['changepercent']) / 100;
                let changeAmount;
                if (changePercent !== 0) {
                    changeAmount = currentPrice / (1 + changePercent) - currentPrice;
                } else {
                    changeAmount = 0;
                }
                let infoText;
                let priceInfoClass;
                if (changePercent > 0) {
                    infoText = `今天黄金涨了↑${Math.abs(changeAmount).toFixed(2)}元，现在为${daygoldItem['price']}元/克`;
                    priceInfoClass = 'increase';
                } else if (changePercent < 0) {
                    infoText = `今天黄金跌了↓${Math.abs(changeAmount).toFixed(2)}元，现在为${daygoldItem['price']}元/克`;
                    priceInfoClass = 'decrease';
                } else {
                    infoText = `今天黄金价格没有变化，现为${daygoldItem['price']}元/克`;
                }
                document.getElementById('goldPriceInfo').textContent = infoText;
                document.getElementById('goldPriceInfo').className = priceInfoClass;
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });

    // 获取国际金价数据
    fetch(domesticGoldApiUrl)
        .then(response => response.json())
        .then(jsonData => {
            updateInternationalGoldTable(jsonData);
        })
        .catch(error => console.error('There has been a problem with your fetch operation:', error));

    // 获取香港金价数据
    fetch(domesticGoldApiUrl)
        .then(response => response.json())
        .then(jsonData => {
            updateHongKongGoldTable(jsonData);
        })
        .catch(error => console.error('There has been a problem with your fetch operation:', error));

    // 获取银行金价数据
    fetch(domesticGoldApiUrl)
        .then(response => response.json())
        .then(jsonData => {
            updateBankGoldTable(jsonData);
        })
        .catch(error => console.error('There has been a problem with your fetch operation:', error));

    // 确保换算工具能够使用当前的金价
    if (domesticGoldData && domesticGoldData['gn']) {
        const daygoldItem = domesticGoldData['gn'].find(item => item['dir'] === 'daygold');
        if (daygoldItem) {
            // 假设这里已经获取到了国内金价数据，并且能够找到daygold项目
            const currentGoldPrice = parseFloat(daygoldItem['price']);
            // 可以在此处调用convert函数，以初始化换算工具的显示
            convert(); // 根据需要决定是否需要自动执行换算
        }
    }

    // 为金额和重量输入框添加事件监听器
    const amountInput = document.getElementById('amount');
    const weightInput = document.getElementById('weight');

    amountInput.addEventListener('input', function() {
        // 当输入金额时，清空重量输入框
        weightInput.value = '';
    });

    weightInput.addEventListener('input', function() {
        // 当输入重量时，清空金额输入框
        amountInput.value = '';
    });
};

function convert() {
    const amountInput = document.getElementById('amount');
    const weightInput = document.getElementById('weight');
    const resultParagraph = document.getElementById('conversionResult');

    let amount = amountInput.value ? parseFloat(amountInput.value) : null;
    let weight = weightInput.value ? parseFloat(weightInput.value) : null;
    let currentGoldPrice = domesticGoldData['gn'].find(item => item['dir'] === 'daygold')['price'];

    if (amount && weight) {
        // 如果两者都输入了，则不进行换算
        resultParagraph.textContent = '请输入金额或重量，但不能同时输入两者。';
        return;
    }

    if (!currentGoldPrice) {
        // 如果当前金价未获取到，则无法进行换算
        resultParagraph.textContent = '当前黄金价格未获取到，请稍后再试。';
        return;
    }

    if (amount) {
        // 如果输入了金额，则计算重量
        const weight = amount / currentGoldPrice;
        resultParagraph.textContent = `${amount}元 可以买 ${weight.toFixed(2)}克`;
    } else if (weight) {
        // 如果输入了重量，则计算金额
        const amount = weight * currentGoldPrice;
        resultParagraph.textContent = `${weight}克 需要花费 ${amount.toFixed(2)}元`;
    } else {
        // 如果两者都没有输入，则提示用户输入
        resultParagraph.textContent = '请输入金额或重量进行换算。';
    }
}
