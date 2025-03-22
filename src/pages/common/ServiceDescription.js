import React, { useState } from "react";

// CSS
import "../../styles/serviceDescription.css";
import {useDispatch} from "react-redux";
import * as constantActions from "../../redux/modules/ConstantSlice";

const ServiceDescription = () => {
    const dispatch = useDispatch();

    const [isOpen, setIsOpen] = useState(false);
    const url = process.env.REACT_APP_SERVICE_DESCRIPTION_URL;

    console.log("url: ", url);

    return (
        <div className="service-description">
            {/* 모달 */}
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-4 rounded-lg w-3/4 h-3/4 relative">
                    {/* 닫기 버튼 */}
                    <button
                        className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded"
                        onClick={() => dispatch(constantActions.onHideModal()) }
                    >
                        닫기
                    </button>

                    {/* URL의 내용을 iframe으로 표시 */}
                    <iframe
                        src={url}
                        className="w-full h-full"
                        title="Embedded Page"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default ServiceDescription;
