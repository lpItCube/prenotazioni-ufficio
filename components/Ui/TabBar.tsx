import { ITabButton } from "../../types"

interface TabBarProps {
    tabButton: ITabButton[],
    onClick: (value:number) => void,
    currentTab: number
}

function TabBar(props: TabBarProps) {
    
    const { 
        tabButton,
        onClick,
        currentTab
    } = props
    return (
        <div className="tabBar__wrapper">
            {tabButton.map((tab:ITabButton) => {
                return(
                    <button
                        key={tab.value}
                        className={`tabBar__button ${currentTab === tab.value ? 'selected' : 'static'}`}
                        onClick={() => onClick(tab.value)}
                        disabled={tab.disabled}
                    >
                        {tab.text}
                    </button>
                )
            })}
        </div>
    )
}

export default TabBar