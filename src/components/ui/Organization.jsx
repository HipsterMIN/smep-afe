import Tree from 'rc-tree'
import 'rc-tree/assets/index.css'

const treeData = [
  {
    title: '전체',
    key: '0',
    children: [
      { title: '중소벤처24', key: '0-0' },
      { title: '중소벤처24kr', key: '0-1' },
      { title: '중소벤처24.pass.dev', key: '0-2' },
      { title: '중소벤처24.pass.dev01', key: '0-3' },
      { title: '중소벤처24.pass.dev02', key: '0-4' },
      { title: '중소벤처24Local', key: '0-5' },
      { title: '중소벤처24.user', key: '0-6' },
    ],
  },
]

function Organization() {
  return (
    <Tree
      treeData={treeData}
      defaultExpandAll
    />
  )
}

export default Organization;
