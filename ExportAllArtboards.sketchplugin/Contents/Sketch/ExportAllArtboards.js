var onRun = function(context) {

	// 스케치 문서를 불러옵니다.
	var doc = context.document;

	//선택한 경로를 불러옵니다.
	var file_path = selectFolder();

	//문서의 모든 페이지를 조회합니다.
	var allPages = [doc pages];

	//각 페이지를 하나씩 선택합니다.
	for (var i = 0; i < allPages.count(); i++) {
		var page = allPages[i];

		//페이지 이름을 불러옵니다. 저장할 파일명에 사용됩니다.
		var namePage = page.name();
		
		//각 페이지의 모든 아트보드를 조회합니다.
		var allArtboards = [page artboards];

		//각 아트보드를 하나씩 선택합니다.
		for (var j = 0; j < allArtboards.count(); j++) {
			var artboard = allArtboards[j]
			
			//아트보드의 이름을 조회합니다. 저장할 파일명에 사용됩니다.
			var nameArtboard = artboard.name();

			var fileNames = [];

			//아트보드를 복제하고 Export 설정값을 초기화합니다.
			var duplicated = artboard.duplicate();
			duplicated.exportOptions().removeAllExportFormats();
			var exportOption = duplicated.exportOptions().addExportFormat();
			exportOption.setScale(1);
			exportOption.setName("@1x");

			//저장할 경로와 파일명을 설정합니다.
			var fileName= file_path + namePage + "/" + nameArtboard + ".png";
			fileNames.push(fileName);

			//Export 합니다.
			var slices = MSExportRequest.exportRequestsFromExportableLayer(duplicated);
			for (var k = 0; k < slices.count(); k++) {
				[doc saveArtboardOrSlice:slices[k] toFile:fileNames[k]];
			}
			
			//복제했던 아트보드를 삭제하고 레이어 선택을 해제합니다.
			duplicated.removeFromParent();
			doc.currentPage().deselectAllLayers();
		}
	}
}

function selectFolder(){
  //open a window to select a folder to save to
  var panel = [NSOpenPanel openPanel];
  [panel setCanChooseDirectories:true];
  [panel setCanCreateDirectories:true];

  //checks if user clicks open in window
  var clicked = [panel runModal];
  if (clicked == NSFileHandlingPanelOKButton) {

    var isDirectory = true;
    var firstURL = [[panel URLs] objectAtIndex:0];
    var unformattedURL = [NSString stringWithFormat:@"%@", firstURL];

    //makes sure spaces aren't formatted to %20
    var file_path = [unformattedURL stringByRemovingPercentEncoding];

    //removes file:// from path
    if (0 === file_path.indexOf("file://")) {
       file_path = file_path.substring(7);
       return file_path;
    }
  }
}
