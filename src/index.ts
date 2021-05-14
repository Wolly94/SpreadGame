type ExampleType = {
  id: number;
};

const x: ExampleType = { id: 0 };

export default ExampleType;

import * as messages from "./messages/index";
import * as spreadGame from "./spreadGame/index";
import * as aiStuff from "./ai/index";

export { messages, spreadGame, aiStuff };
