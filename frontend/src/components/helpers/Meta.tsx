// frontend\src\components\helpers\Meta.tsx

import { Helmet } from "react-helmet-async";
import React from "react";

interface Props {
  title?: string;
  description?: string;
  keywords?: string;
}

const Meta: React.FC<Props> = ({
  title = "Welcome To Shop",
  description = "We sell the best products for cheap",
  keywords = "electronics, buy electronics, cheap electronics",
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keywords} />
    </Helmet>
  );
};

export default Meta;
