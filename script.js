// 接口地址
const brandsApiUrl = 'https://api.jinjia.com.cn/index.php?m=app&a=brand&mi=0&cache=1';
const domesticGoldApiUrl = 'https://api.jinjia.com.cn/index.php?m=app&mi=0&cache=1';

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

// 打开指定标签的函数
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("table-container");
    if (tabName != "Home") {
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
    } else {
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "block";
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
                    infoText = `今天黄金涨了↑${changeAmount.toFixed(2)}元，现在为${daygoldItem['price']}元/克`;
                    priceInfoClass = 'increase';
                    document.getElementById('goldPriceInfo').className = increase;
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
};