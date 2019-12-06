

var g_reader = new FileReader();
var g_File;
var fileElem = document.getElementById("importFile_file");
fileElem.onchange = function(event) {
    g_File = event.target.files[0];
};

var g_DasyutuGameData;
var g_PageList = [];
var g_ItemList = [];
var g_ItemMixList = [];

var g_CurrentPageNo = 1;
var g_CurrentPageID;

HiddenAllTab();
function ImportGameData(){
      var fileRef = document.getElementById('importFile_file');
	  var content;
	  
	if (1 <= fileRef.files.length) {
		var reader = new FileReader();
		//ファイル読み出し完了後の処理を記述
		reader.onload = function (theFile) {
			var content = theFile.target.result;
			g_DasyutuGameData = JSON.parse(content);
			
			g_PageList = g_DasyutuGameData.pageList;
			g_ItemList = g_DasyutuGameData.itemList;
			g_ItemMixList = g_DasyutuGameData.itemMixList;
			
			InitGameData();
		}
			
		//ファイル読み出し
        reader.readAsText(fileRef.files[0], "utf-8");
	}
}



function InitGameData(){

	HiddenAllTab();
	ShowPageTab(g_PageList[0].PageID)
}

function ShowItemDiv(){
	HiddenAllTab();
	
	var divElem = document.getElementById("ItemTab");
	divElem.style.display = 'block';
}

function ShowItemMixDiv(){
	HiddenAllTab();
	
	var divElem = document.getElementById("ItemMixTab");
	divElem.style.display = 'block';
}


//すべてのタブを非表示にする
function HiddenAllTab(){
	var tabElem1;
	
	tabElem1 = document.getElementById("GameTab");
	tabElem1.style.display = 'none';
	
	tabElem1 = document.getElementById("ItemTab");
	tabElem1.style.display = 'none';
	
	tabElem1 = document.getElementById("ItemMixTab");
	tabElem1.style.display = 'none';
	
}

function HiddenAllSubElemInPageTab(){
	var divElem1;
	
	divElem1 = document.getElementById("PassWordInput");
	divElem1.style.display = 'none';
	
	divElem1 = document.getElementById("ChooseLinkTab");
	divElem1.style.display = 'none';
	
	divElem1 = document.getElementById("ToolIDInput");
	divElem1.style.display = 'none';
	
}

function JumpPage(){
	var pageID = document.getElementById("GamePageIDTextBox").value;
	ShowPageTab(pageID);
}

//最初のページに戻る
function GoToStart(){
	HiddenAllTab();
	ShowPageTab(g_PageList[0].PageID)
}

function ShowPageTab(pageID){

	var pageInfo1 = GetPageFromPageID(pageID);
	g_CurrentPageNo = pageInfo1.PageNo;
	g_CurrentPageID = pageInfo1.PageID;
	
	var spanElem = document.getElementById("CurrentPageID");
	spanElem.innerHTML = pageID;
	
	var ImgElem = document.getElementById("GameImg");
	ImgElem.src = pageInfo1.ImageURL;
	
	var commentElem = document.getElementById("GameComment")
	commentElem.innerHTML = pageInfo1.Comment;
	
	HiddenAllSubElemInPageTab();
	
	var divElem1;
	var btnElem1;
	var btnElem2;
	var btnElem3;
	
	if(pageInfo1.PageType == "ChooseLink"){
	
		btnElem1 = document.getElementById("ChooseLink1");
		btnElem2 = document.getElementById("ChooseLink2");
		btnElem3 = document.getElementById("ChooseLink3");
		
		if(pageInfo1.PageNoOfLink1 != "-"){
			btnElem1.value = pageInfo1.Link1;
			btnElem1.style.display = 'block';
		}else{
			btnElem1.style.display = 'none';
		}
		
		if(pageInfo1.PageNoOfLink2 != "-"){
			btnElem2.value = pageInfo1.Link2;
			btnElem2.style.display = 'block';
		}else{
			btnElem2.style.display = 'none';
		}
		
		if(pageInfo1.PageNoOfLink3 != "-"){
			btnElem3.value = pageInfo1.Link3;
			btnElem3.style.display = 'block';
		}else{
			btnElem3.style.display = 'none';
		}
	
		divElem1 = document.getElementById("ChooseLinkTab");
		divElem1.style.display = 'block';
		
	}else if(pageInfo1.PageType == "InputOnePassword"){
		divElem1 = document.getElementById("PassWordInput");
		divElem1.style.display = 'block';
		
	}else if(pageInfo1.PageType == "ShowOnly"){
		//何もしない
	}else if(pageInfo1.PageType == "InputTwoPassword"){
		divElem1 = document.getElementById("PassWordInput");
		divElem1.style.display = 'block';
	}else if(pageInfo1.PageType == "UseTool"){
		divElem1 = document.getElementById("ToolIDInput");
		divElem1.style.display = 'block';
	}
	var tabElem1;
	
	tabElem1 = document.getElementById("GameTab");
	tabElem1.style.display = 'block';
	

}

function InputPassword(){
	var passWordText = document.getElementById("GamePasswordTextBox").value;
	
	var pageInfo1= GetPageFromPageNo(g_CurrentPageNo);
	var pageInfo2;
	if(pageInfo1.CorrectPas1 != "-" &&
	   pageInfo1.CorrectPas1 == passWordText){
	   
	   pageInfo2 = GetPageFromPageNo(pageInfo1.PageNoOfCorrectPas1);
	   
	}else if(pageInfo1.CorrectPas2 != "-" &&
	   pageInfo1.CorrectPas2 == passWordText){
	   
	   pageInfo2 = GetPageFromPageNo(pageInfo1.PageNoOfCorrectPas2);
	   
	}else{
	
	   pageInfo2 = GetPageFromPageNo(pageInfo1.PageNoOfInCorrectPas);
	   
	}
	
	ShowPageTab(pageInfo2.PageID);
}


function InputToolId(){
	var toolIDText = document.getElementById("ToolIDInUseToolPage").value;
	
	var pageInfo1= GetPageFromPageNo(g_CurrentPageNo);
	
	var ItemInfo1 = GetItemFromItemID(toolIDText);
	
	if(ItemInfo1 != null &&
	   pageInfo1.CanUseToolName1 != "-" &&
	   pageInfo1.CanUseToolName1 == ItemInfo1.ItemName){
	   
	   pageInfo2 = GetPageFromPageNo(pageInfo1.PageNoOfTool1);
	   
	}else if(ItemInfo1 != null &&
	   pageInfo1.CanUseToolName2 != "-" &&
	   pageInfo1.CanUseToolName2 == ItemInfo1.ItemName){
	   
	   pageInfo2 = GetPageFromPageNo(pageInfo1.PageNoOfTool2);
	   
	}else{
	
	   pageInfo2 = GetPageFromPageNo(pageInfo1.PageNoOfInCorrectTool);
	   
	}
	
	ShowPageTab(pageInfo2.PageID);
}

function ChooseLink1(){
	var CurrentPageInfo = GetPageFromPageNo(g_CurrentPageNo);
	var PageInfo2 = GetPageFromPrevPageAndLinkNo(CurrentPageInfo,1);
	
	ShowPageTab(PageInfo2.PageID);
}

function ChooseLink2(){
	var CurrentPageInfo =GetPageFromPageNo(g_CurrentPageNo);
	var PageInfo2 = GetPageFromPrevPageAndLinkNo(CurrentPageInfo,2);
	
	ShowPageTab(PageInfo2.PageID);
}

function ChooseLink3(){
	var CurrentPageInfo =GetPageFromPageNo(g_CurrentPageNo);
	var PageInfo2 = GetPageFromPrevPageAndLinkNo(CurrentPageInfo,3);
	
	ShowPageTab(PageInfo2.PageID);
}

function SearchItem(){
	var ItemID = document.getElementById("ItemIDTextBoxOnItemTab").value;
	var ItemInfo = GetItemFromItemID(ItemID);
	
	if(ItemID != null){
		ShowItemTab(ItemID);
	}
}

function MixItem(){
	var ItemID1 = document.getElementById("ItemID1TextBoxOnItemMixTab").value;
	var ItemID2 = document.getElementById("ItemID2TextBoxOnItemMixTab").value;
	
	var ItemInfo1 = GetItemFromItemID(ItemID1);
	var ItemInfo2 = GetItemFromItemID(ItemID2);
	
	var MixResultSpan = document.getElementById("MixResultComment");
	if(ItemInfo1 != null && ItemInfo2 != null){
		var ItemMixInfo1 = GetItemMixFromPrevItems(ItemInfo1.ItemName, ItemInfo2.ItemName);
		if(ItemMixInfo1 != null){
			var ItemInfo3 = GetItemFromItemName(ItemMixInfo1.NewItemName)

			var str = ItemInfo1.ItemName;
			str += "(ID:" + ItemInfo1.ItemID + ")";
			str += " と ";
			str += ItemInfo2.ItemName;
			str += "(ID:" + ItemInfo2.ItemID + ")";
			str += " を合成して ";
			str += ItemInfo3.ItemName;
			str += "(ID:" + ItemInfo3.ItemID + ")";
			str += " を入手した!";
			
			MixResultSpan.innerHTML = str;
			
		}else{
		
			var str = ItemInfo1.ItemName;
			str += "(ID:" + ItemInfo1.ItemID + ")";
			str += " と ";
			str += ItemInfo2.ItemName;
			str += "(ID:" + ItemInfo2.ItemID + ")";
			str += " の合成は失敗した... ";
			
			MixResultSpan.innerHTML = str;
		}
	}else if(ItemInfo1 == null){
			var str = ItemID1;
			str += " のIDを持つ道具が見つかりません ";
			
			MixResultSpan.innerHTML = str;
	}else if(ItemInfo2 == null){
			var str = ItemID2;
			str += " のIDを持つ道具が見つかりません ";
			
			MixResultSpan.innerHTML = str;
	}

	
}

function ShowItemTab(ItemID){
	HiddenAllTab();
	
	var ItemInfo1 = GetItemFromItemID(ItemID);
	
	if(ItemInfo1 != null){
		var spanElem = document.getElementById("ToolName");
		spanElem.innerHTML = ItemInfo1.ItemName;
		
		var imgElem = document.getElementById("ToolImg");
		imgElem.src = ItemInfo1.ImageURL;
		
		spanElem = document.getElementById("ToolComment");
		spanElem.innerHTML = ItemInfo1.commentOfItem;
		
	}else{
		var spanElem = document.getElementById("ToolName");
		spanElem.innerHTML = "探している道具IDの道具はないようです...";
	}
	
	ShowItemDiv();
	
}
function GetPageFromPrevPageAndLinkNo(prevPageInfo, LinkNo){
	var PageInfo1 = null;
	
	if(LinkNo == 1){
		PageInfo1 = GetPageFromPageNo(prevPageInfo.PageNoOfLink1);
	}else if(LinkNo == 2){
		PageInfo1 = GetPageFromPageNo(prevPageInfo.PageNoOfLink2);
	}else if(LinkNo == 3){
		PageInfo1 = GetPageFromPageNo(prevPageInfo.PageNoOfLink3);
	}
	
	return PageInfo1;
}

function GetPageFromPageNo(pageNo){
	var pageInfo1;
	
	for(i=0; i<g_PageList.length; i++){
		pageInfo1 = g_PageList[i];
		if(pageNo == pageInfo1.PageNo){
			return pageInfo1;
		}
	}
	return null;
}

function GetPageFromPageID(pageID){
	var pageInfo1;
	
	for(i=0; i<g_PageList.length; i++){
		pageInfo1 = g_PageList[i];
		if(pageID == pageInfo1.PageID){
			return pageInfo1;
		}
	}
	return null;
}

function GetItemFromItemID(itemID){
	var itemInfo1;
	
	for(i=0; i<g_ItemList.length; i++){
		itemInfo1 = g_ItemList[i];
		if(itemID == itemInfo1.ItemID){
			return itemInfo1;
		}	
	}
	return null;
}

function GetItemFromItemName(itemName){
	var itemInfo1;
	
	for(i=0; i<g_ItemList.length; i++){
		itemInfo1 = g_ItemList[i];
		if(itemName == itemInfo1.ItemName){
			return itemInfo1;
		}	
	}
	return null;
}

function GetItemMixFromPrevItems(prevItemName1, prevItemName2){
	var itemMixInfo1;
	
	for(i=0; i<g_ItemMixList.length; i++){
		itemMixInfo1 = g_ItemMixList[i];
		if(prevItemName1 == itemMixInfo1.ItemName1 &&
		   prevItemName2 == itemMixInfo1.ItemName2){
		   return itemMixInfo1;
		}else if(prevItemName2 == itemMixInfo1.ItemName1 &&
		   prevItemName1 == itemMixInfo1.ItemName2){
		   return itemMixInfo1;
		}
	}
	return null;
}
