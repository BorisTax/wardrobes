import EditMatSkladThick from "./EditMatSkladThick"
import EditMatSkladColor from "./EditMatSkladColor"


export default function EditMat() {
    return <div>
        <hr/>
        <div className="sklad-editor-container">
            <div className="sklad-editor-container-item">
                <EditMatSkladThick />
            </div>
            <div className="sklad-editor-container-item">
                <EditMatSkladColor />
            </div>
        </div>
    </div>
}
