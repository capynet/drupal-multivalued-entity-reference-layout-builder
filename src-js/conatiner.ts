import { Container } from 'inversify';
import 'reflect-metadata';
import TYPES from "./types";
import Utils from "./lib/utils/Utils";
import Events from "./lib/utils/Events";
import FormOptionHandlers from "./lib/utils/FormOptionHandlers";
import Sidebar from "./lib/managers/Sidebar";
import ConfigManager from "./lib/managers/ConfigManager";
import ComponentsManager from "./lib/managers/ComponentsManager";
import StartEditorQuickLinks from "./lib/utils/StartEditorQuickLinks";
import LiveLayoutMiniMap from "./lib/managers/LiveLayoutMiniMap";
import Grid from "./lib/managers/Grid";
import LiveLayoutManager from "./lib/managers/LiveLayoutManager";
import UserTracker from "./lib/utils/UserTracker";
import PreviewQuickLinks from "./lib/utils/PreviewQuickLinks";
import Serializer from "./lib/utils/Serializer";
import LayoutBuilder from "./lib/LayoutBuilder";
import AppParams from "./lib/utils/AppParams";


const container = new Container();

// Here we link the service name with the real class so in the future
// doing @inject(TYPES.foo) will inject the linked class instance
container.bind(TYPES.appParams).to(AppParams).inSingletonScope()
container.bind(TYPES.utils).to(Utils).inSingletonScope()
container.bind(TYPES.events).to(Events).inSingletonScope()
container.bind(TYPES.sidebar).to(Sidebar).inSingletonScope()
container.bind(TYPES.formOptionHandlers).to(FormOptionHandlers).inSingletonScope()
container.bind(TYPES.configManager).to(ConfigManager).inSingletonScope()
container.bind(TYPES.componentsManager).to(ComponentsManager).inSingletonScope()
container.bind(TYPES.startEditorQuickLinks).to(StartEditorQuickLinks)
container.bind(TYPES.liveLayoutMiniMap).to(LiveLayoutMiniMap)
container.bind(TYPES.grid).to(Grid).inSingletonScope()
container.bind(TYPES.liveLayoutManager).to(LiveLayoutManager)
container.bind(TYPES.userTracker).to(UserTracker).inSingletonScope()
container.bind(TYPES.previewQuickLinks).to(PreviewQuickLinks).inSingletonScope()
container.bind(TYPES.serializer).to(Serializer).inSingletonScope()
container.bind(TYPES.layoutBuilder).to(LayoutBuilder)

export default container;
