const LibraryCreator = {
    start: (blocksJSON, category, text) => {
      let blockArray = new Array
      // LibraryCreator 가져오기
      
      Entry.staticBlocks = EntryStatic.getAllBlocks()
      EntryStatic.getAllBlocks = () => {
        return Entry.staticBlocks;
      }
      Entry.staticCategories = EntryStatic.getAllBlocks().map(v =>
      {
          return {
              category: v.category,
              visible: true
          }
      })
      console.info(Entry.staticCategories);
      function updateCategory(category, options) {
        let categories = Entry.staticCategories;
        categories.push( { category: category, visible: true } );
        Entry.playground.mainWorkspace.blockMenu._generateCategoryView(categories);
        for (let i = 0; i < $('.entryCategoryElementWorkspace').length; i++) {
          if (!($($('.entryCategoryElementWorkspace')[i]).attr('id') == "entryCategorytext")) {
            $($('.entryCategoryElementWorkspace')[i]).attr('class', 'entryCategoryElementWorkspace');
          }
        }
        Entry.playground.blockMenu._categoryData = EntryStatic.getAllBlocks();
        Entry.playground.blockMenu._generateCategoryCode(category);
        if (options) {
          if (options.background) {
            $(`#entryCategory${category}`).css('background-image', 'url(' + options.background + ')');
            $(`#entryCategory${category}`).css('background-repeat', 'no-repeat');
            if (options.backgroundSize) {
              $(`#entryCategory${category}`).css('background-size', options.backgroundSize + "px");
            }
          }
          if (options.name) {
            $(`#entryCategory${category}`)[0].innerText = options.name
          }
        }
      }
      function addBlock(blockname, template, color, params, _class, func, skeleton = 'basic') {
        Entry.block[blockname] = {
          color: color.color,
          fontColor: color.font,
          outerLine: color.outline,
          skeleton: skeleton,
          statement: [],
          params: params.params,
          events: {},
          def: {
            params: params.define,
            type: blockname
          },
          paramsKeyMap: params.map,
          class: _class ? _class : 'default',
          func: func,
          template: template
        }
      }
      // 블록 추가하기
      for (let i in blocksJSON) {
        let block = blocksJSON[i]
        blockArray.push(block.name)
        addBlock(block.name, block.template, { color: block.color.default, outerLine: block.color.darken }, { params: block.params, define: block.def, map: block.map }, block.class, block.func, block.skeleton)
      }
      // 블록 반영
      Entry.staticBlocks.push({ category: category, blocks: blockArray })
      // 카테고리 업데이트 (ws에서만)
      if (typeof useWebGL == "undefined") {
        updateCategory(category)
        // 아이콘 적용
        $('head').append(`<style>#entryCategory${category}{background-image:url(https://raw.githack.com/thoratica/EntBlocks/master/other.svg);background-repeat:no-repeat;margin-bottom:1px;background-position-y: 10px;background-size: 20px;}.entrySelectedCategory#entryCategory${category}{background-image:url(https://raw.githack.com/thoratica/EntBlocks/master/other_selected.svg);background-color:#FFC000;border-color:#FFC000;color:#fff}</style>`)
        // 카테고리 이름 적용
        $(`#entryCategory${category}`).append(text)
      }
      console.log('로딩을 시작합니다.')
    }
  }
  const blocks = [
//////////////////////////////////////
    {
      name: 'firsttext', // 이름 지정
      template: '%1', // 표시할 내용
      skeleton: 'basic_text', // 형식(기본 텍스트)
      color: { // 색깔
        default: EntryStatic.colorSet.common.TRANSPARENT, // 투명
        darken: EntryStatic.colorSet.common.TRANSPARENT // 투명
      },
      params: [ // %n의 형식 지정
        { // %1의 형식 정의
          type: 'Text', // 텍스트 형식
          text: 'Web', // 표시 내용
          color: EntryStatic.colorSet.common.TEXT, // 검은색
          align: 'center'
        }
      ],
      def: [],
      map: {},
      class: 'text'
    },
//////////////////////////////////////

//////////////////////////////////////
    {
      name: 'SearchGoogle', // 블럭 이름 지정
      template: '%1 내용을 구글에 검색하기%2', // 표시할 내용
      skeleton: 'basic', // 블럭 형식(basic은 일반 블럭)
      color: { // 색깔
        default: '#15b01a', //RGB 색깔
        darken: '#15b01a' //RGB 색깔
      },
      params: [ // %n 정의
        { // %1 정의
          type: 'Block', // 형식 지정(입력값)
          accept: 'string'
        },
        { // %2 정의
          type: 'Indicator', // 형식 지정(이미지)
          img: '', // 이미지 링크
          size: 11, // 크기
        }
      ],
      def: [ // %n 기본값
        { // %1 정의
          type: 'text',
          params: ['엔트리'] // 기본으로 입력된 값
        },
        null // %2 정의(이미지 형식이므로 null로 설정)
      ],
      map: {
        SEARCHRESULT: 0 // %1의 입력값을 불러올 변수 이름(대문자)
      },
      class: 'text',
      func: async (sprite, script) => { // 실행할 JS 코드
        // script.getValue('위에 map에서 설정한 변수 이름', script) 이 코드로 입력값 로드 가능
        open('https://google.com/search?q=' + script.getValue('SEARCHRESULT', script));
        return script.callReturn() // 일반 블럭 코드 뒤에는 반드시 붙여주세요
      },
    }
//////////////////////////////////////
  ]
  
  LibraryCreator.start(blocks, 'API', '특급')