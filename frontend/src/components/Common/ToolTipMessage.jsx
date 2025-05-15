import { Tooltip } from "react-tooltip";
import { FaCircleExclamation } from "react-icons/fa6";

const ToolTipMessage = ({ success = false, message }) => {
    return (
        <div className="absolute top-1/2 -translate-y-1/2 right-4 z-50">
            <div
                data-tooltip-id="my-tooltip"
                data-tooltip-content={message}
                className={`${success ? "text-green-500" : "text-red-500"}`}>
                <FaCircleExclamation />
            </div>
            <Tooltip
                id="my-tooltip"
                className="z-10 absolute max-w-xs break-words bg-gray-800 text-white text-base p-2 rounded"
            />
        </div>
    );
};

export default ToolTipMessage;
