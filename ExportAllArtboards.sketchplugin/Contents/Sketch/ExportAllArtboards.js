// 스케치 플러그인으로 실행되기 위한 함수를 정의합니다.
var onRun = function(context) {

	// 스케치 애플리케이션을 조회합니다.
	var app = [NSApplication sharedApplication];

	// 열려있는 스케치 문서를 조회합니다.
	var doc = context.document;
	// 이미지 저장 경로를 호출합니다.
	var file_path = selectFolder();
	// 페이지를 조회합니다.
	var allPages = [doc pages];

	// 조회한 모든 페이지에 대해 반복 실행합니다.
	for (var i = 0; i < allPages.count(); i++) {
		// 페이지를 선택합니다.
		var page = allPages[i];
		// 저장 경로에 사용하기 위해 페이지 이름을 조회합니다.
		var namePage = page.name();
		// 선택한 페이지의 아트보드를 조회합니다.
		var allArtboards = [page artboards];

		// 조회한 모든 아트보드에 대해 반복 실행합니다.
		for (var j = 0; j < allArtboards.count(); j++) {
			// 아트보드를 선택합니다.
			var artboard = allArtboards[j]
			// 저장 경로에 사용하기 위해 아트보드 이름을 조회합니다.
			var nameArtboard = artboard.name();

			// 선택한 아트보드를 복제합니다.
			var duplicated = artboard.duplicate();
			// b복제한 아트보드의 Export 설정값을 초기화합니다.
			duplicated.exportOptions().removeAllExportFormats();
			var exportOption = duplicated.exportOptions().addExportFormat();
			exportOption.setScale(1);
			exportOption.setName("@1x");

			// 이미지 저장 경로를 호출합니다.
			var fileNames = [];
			var fileName= file_path + namePage + "/" + nameArtboard + ".png";
			fileNames.push(fileName);

			// 선택한 아트보드를 Export 합니다.
			var slices = MSExportRequest.exportRequestsFromExportableLayer(duplicated);
			for (var k = 0; k < slices.count(); k++) {
				[doc saveArtboardOrSlice:slices[k] toFile:fileNames[k]];
			}
			
			//복제한 아트보드를 삭제합니다.
			duplicated.removeFromParent();
			doc.currentPage().deselectAllLayers();
		}
	}

  // 결과 메시지를 출력합니다.
  [app displayDialog: file_path + " 에 이미지 파일을 저장했습니다." withTitle:"성공!"];
}


// 파인더를 실행하여 이미지 저장 경로를 선택합니다.
function selectFolder(){
  var panel = [NSOpenPanel openPanel];
  [panel setCanChooseDirectories:true];
  [panel setCanCreateDirectories:true];

  var clicked = [panel runModal];
  if (clicked == NSFileHandlingPanelOKButton) {

    var isDirectory = true;
    var firstURL = [[panel URLs] objectAtIndex:0];
    var unformattedURL = [NSString stringWithFormat:@"%@", firstURL];

    var file_path = [unformattedURL stringByRemovingPercentEncoding];

    if (0 === file_path.indexOf("file://")) {
       file_path = file_path.substring(7);
       return file_path;
    }
  }
}
