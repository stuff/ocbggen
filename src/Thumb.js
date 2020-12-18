import classnames from "classnames";

import Template from "./Template";

const Thumb = ({ theme, selected }) => {
  return (
    <span className={classnames("thumb", { "thumb--selected": selected })}>
      <Template theme={theme} logoText="Lorem Ipsum" width="120" />
    </span>
  );
};

export default Thumb;
