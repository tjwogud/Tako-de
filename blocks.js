if (Entry.tako_de) {
  throw new Error('[Tako-de] 타코-드가 이미 실행되었습니다.')
}
Entry.tako_de = true

const title = '타코-드'
const category = 'Tako-de'
const iconUrl = 'https://raw.githubusercontent.com/tjwogud/Tako-de/main/takodachi_icon.png'
const imgUrl = 'https://raw.githubusercontent.com/tjwogud/Tako-de/main/takodachi.svg'

const blocks = [
//////////////////////////////////////
  {
    name: 'title',
    template: '%1',
    skeleton: 'basic_text',
    params: [
      {
        type: 'Text',
        text: 'Tako-de,\nby 타코다치',
        color: EntryStatic.colorSet.common.TEXT,
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
    name: 'OpenUrl',
    template: '%1 사이트 열기',
    skeleton: 'basic',
    params: [
      {
        type: 'Block',
        accept: 'string'
      }
    ],
    def: [
      {
        type: 'text',
        params: ['https://playentry.org/ws']
      }
    ],
    map: {
      URL: 0
    },
    class: 'text',
    func: async (sprite, script) => {
      console.info(script.getValue('URL', script))
      open(script.getValue('URL', script));
      return script.callReturn()
    },
  }
//////////////////////////////////////
]

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

const originFunc = Entry.SVG.attr
Entry.SVG.attr = function(options, property) {
  if (options && options.href) {
    let sliced = options.href.slice(Entry.mediaFilePath.length)
    if (sliced.startsWith('https://')) {
      options.href = sliced
    }
  }

  return originFunc.call(this, options, property)
};

let blockArray = new Array
for (let i in blocks) {
  let block = blocks[i]
  blockArray.push(block.name)
  block.template.append(` %${block.params.length + 1}`)
  block.params.append( { type: 'Indicator', img: iconUrl, size: 11 } )
  block.def.append(null)
  Entry.block[block.name] = {
    color: (block.skeleton === 'basic_text') ? EntryStatic.colorSet.common.TRANSPARENT : '#AA55BB',
    fontColor: '#FFFFFF',
    outerLine: (block.skeleton === 'basic_text') ? EntryStatic.colorSet.common.TRANSPARENT : '#884499',
    skeleton: block.skeleton,
    statement: [],
    params: block.params,
    events: {},
    def: {
      params: block.def,
      type: block.name
    },
    paramsKeyMap: block.map,
    class: block.class ? block.class : 'default',
    func: block.func,
    template: block.template
  }
}
Entry.staticBlocks.push({ category: category, blocks: blockArray })
if (typeof useWebGL == "undefined") {
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
  $('head').append(`<style>#entryCategory${category}{background-image:url(${imgUrl});background-repeat:no-repeat;margin-bottom:1px;background-position-y: 10px;background-size: 25px;}.entrySelectedCategory#entryCategory${category}{background-image:url(${imgUrl});background-color:#AA55BB;border-color:#884499;color:#fff}</style>`)
  $(`#entryCategory${category}`).append(title)
}
console.log('[Tako-de] 로딩 시작')