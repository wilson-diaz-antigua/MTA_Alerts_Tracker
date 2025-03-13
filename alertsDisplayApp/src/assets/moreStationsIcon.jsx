import objects from '../../util/subwayLineColors.json';

const moreStationsIcon = (props) => {
  return (


    <div className={`icon h-[70px] w-[30px] bg-zinc-900 fill-current pt-2 ${objects.dottedColors[props.filtlines]}`}>



      <svg
        viewBox='0 0 50 150'
        width='20'
        height='60'
        xmlns='http://www.w3.org/2000/svg'
      >
        <ellipse cx='25' cy='20' rx='10' ry='10' />
        <ellipse cx='25' cy='60' rx='10' ry='10' />
        <ellipse cx='25' cy='100' rx='10' ry='10' />
      </svg>
    </div>

  )
}

export default moreStationsIcon