<template>
	<div>
		<p>{{msg}}</p>
		<div><input id="importf" type="file" @change="importf(this)" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
		</div>
		<pre style="color: red;">{{error}}</pre>
		<el-table :data="tableData" style="width: 100%">
			<el-table-column prop="name" label="姓名">
			</el-table-column>
			<el-table-column prop="stuNo" label="学号">
			</el-table-column>
			<el-table-column prop="passNo" label="身份证">
			</el-table-column>
			<el-table-column prop="phone" label="手机号">
			</el-table-column>
		</el-table>
	</div>
</template>


<script>
	export default {
		name: 'Index',
		data() {
			return {
				msg: '测试导入功能',
				tableData: [],
				error: ''
			}
		},
		methods: {
			//列中的重复数据
			repeat(outdata, val) {
				let _this = this
				//重复数据
				let repList = outdata.map((item, index) => {
					let data = outdata.findIndex(a => a[val] === item[val]);
					return data
				})
				// 				repList.forEach((item, index) => {
				// 					if (repList.indexOf(item) != index) { // 匹配数组元素第一个item位置和当前循环的index
				// 						_this.error += '第' + (repList.indexOf(item) + 1) + '和' + (index + 1) + '行' + val + '重复\n'
				// 					}
				// 				});
				_this.searchKeys(repList, val)
			},
			searchKeys(arr, val) {
				var strary = [];
				for (var i = 0; i < arr.length; i++) {
					var hasRead = false;
					for (var k = 0; k < strary.length; k++) {
						if (strary[k] == arr[i]) {
							hasRead = true;
						}
					}
					if (!hasRead) {
						var _index = i,
							haveSame = false;
						for (var j = i + 1; j < arr.length; j++) {
							if (j == parseInt(i) + parseInt(1)) {
								_index++;
							}
							if (arr[i] == arr[j]) {
								_index += "," + (parseInt(j) + 1);
								haveSame = true;
							}
						}
						if (haveSame) {
							strary.push(arr[i]);
							this.error += val + "第" + _index + "行数据重复\n";
						}
					}
				}
			},
			importf(obj) {
				let _this = this;
				let inputDOM = this.$refs.inputer; // 通过DOM取文件数据
				this.file = event.currentTarget.files[0];
				var rABS = false; //是否将文件读取为二进制字符串
				var f = this.file;
				var reader = new FileReader();
				//if (!FileReader.prototype.readAsBinaryString) {
				FileReader.prototype.readAsBinaryString = function(f) {
					var binary = "";
					var rABS = false; //是否将文件读取为二进制字符串
					var pt = this;
					var wb; //读取完成的数据
					var outdata;
					var reader = new FileReader();
					reader.onload = function(e) {
						var bytes = new Uint8Array(reader.result);
						var length = bytes.byteLength;
						for (var i = 0; i < length; i++) {
							binary += String.fromCharCode(bytes[i]);
						}
						var XLSX = require('xlsx');
						if (rABS) {
							wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
								type: 'base64'
							});
						} else {
							wb = XLSX.read(binary, {
								type: 'binary'
							});
						}
						// outdata就是你想要的东西 excel导入的数据
						outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

						// 获取表头名字
						let keyName = []
						for (let i in outdata[0]) {
							keyName.push(i); //把json键名加入表头数组
						}
						console.log(keyName, '表头')
						//重复数据
						_this.repeat(outdata, '学号')
						_this.repeat(outdata, '身份证')
						_this.repeat(outdata, '手机号')
						let cardTest =
							/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|31)|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/
						let phoneTest = /^1[3456789]\d{9}$/
						//验证表格
						outdata.forEach((item, index) => {
							if (cardTest.test(item.身份证) !== true)
								_this.error += '身份证第' + (index + 1) + '行格式有误\n'
							if (phoneTest.test(item.手机号) !== true)
								_this.error += '手机号第' + (index + 1) + '行格式有误\n'
						})
						// if(_this.error==='')如果没有报错再做入库处理处理
						// excel 数据再处理
						let arr = []
						outdata.map(v => {
							let obj = {}
							obj.name = v.姓名
							obj.stuNo = v.学号
							obj.passNo = v.身份证
							obj.phone = v.手机号
							arr.push(obj)
						})
						_this.tableData = [...arr]
						console.log(_this.tableData, '转变后数据')
						document.getElementById('importf').value = null; //清除相同文件不出发
					}
					reader.readAsArrayBuffer(f);
				}
				if (rABS) {
					reader.readAsArrayBuffer(f);
				} else {
					reader.readAsBinaryString(f);
				}
			}

		}
	}
</script>
<style>
</style>
