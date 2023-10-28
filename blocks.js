const LibraryCreator = {
    start: (blocksJSON, category, text) => {
      let blockArray = new Array
      // LibraryCreator ��������
      
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
      // ��� �߰��ϱ�
      for (let i in blocksJSON) {
        let block = blocksJSON[i]
        blockArray.push(block.name)
        addBlock(block.name, block.template, { color: block.color.default, outerLine: block.color.darken }, { params: block.params, define: block.def, map: block.map }, block.class, block.func, block.skeleton)
      }
      // ��� �ݿ�
      Entry.staticBlocks.push({ category: category, blocks: blockArray })
      // ī�װ� ������Ʈ (ws������)
      if (typeof useWebGL == "undefined") {
        updateCategory(category)
        // ������ ����
        $('head').append(`<style>#entryCategory${category}{background-image:url(https://raw.githack.com/thoratica/EntBlocks/master/other.svg);background-repeat:no-repeat;margin-bottom:1px;background-position-y: 10px;background-size: 20px;}.entrySelectedCategory#entryCategory${category}{background-image:url(https://raw.githack.com/thoratica/EntBlocks/master/other_selected.svg);background-color:#FFC000;border-color:#FFC000;color:#fff}</style>`)
        // ī�װ� �̸� ����
        $(`#entryCategory${category}`).append(text)
      }
      console.log('�ε��� �����մϴ�.')
    }
  }
  const blocks = [
//////////////////////////////////////
    {
      name: 'firsttext', // �̸� ����
      template: '%1', // ǥ���� ����
      skeleton: 'basic_text', // ����(�⺻ �ؽ�Ʈ)
      color: { // ����
        default: EntryStatic.colorSet.common.TRANSPARENT, // ����
        darken: EntryStatic.colorSet.common.TRANSPARENT // ����
      },
      params: [ // %n�� ���� ����
        { // %1�� ���� ����
          type: 'Text', // �ؽ�Ʈ ����
          text: 'Web', // ǥ�� ����
          color: EntryStatic.colorSet.common.TEXT, // ������
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
      name: 'SearchGoogle', // �� �̸� ����
      template: '%1 ������ ���ۿ� �˻��ϱ�%2', // ǥ���� ����
      skeleton: 'basic', // �� ����(basic�� �Ϲ� ��)
      color: { // ����
        default: '#15b01a', //RGB ����
        darken: '#15b01a' //RGB ����
      },
      params: [ // %n ����
        { // %1 ����
          type: 'Block', // ���� ����(�Է°�)
          accept: 'string'
        },
        { // %2 ����
          type: 'Indicator', // ���� ����(�̹���)
          img: '', // �̹��� ��ũ
          size: 11, // ũ��
        }
      ],
      def: [ // %n �⺻��
        { // %1 ����
          type: 'text',
          params: ['��Ʈ��'] // �⺻���� �Էµ� ��
        },
        null // %2 ����(�̹��� �����̹Ƿ� null�� ����)
      ],
      map: {
        SEARCHRESULT: 0 // %1�� �Է°��� �ҷ��� ���� �̸�(�빮��)
      },
      class: 'text',
      func: async (sprite, script) => { // ������ JS �ڵ�
        // script.getValue('���� map���� ������ ���� �̸�', script) �� �ڵ�� �Է°� �ε� ����
        open('https://google.com/search?q=' + script.getValue('SEARCHRESULT', script));
        return script.callReturn() // �Ϲ� �� �ڵ� �ڿ��� �ݵ�� �ٿ��ּ���
      },
    }
//////////////////////////////////////
  ]
  
  LibraryCreator.start(blocks, 'API', 'Ư��')