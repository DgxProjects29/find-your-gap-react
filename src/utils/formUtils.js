import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import useFetch from "use-http";

export function useFormRequest({
  itemPath = "",
  updatePk = 0,
  updateWithPatch = false,
  onSuccess = () => {},
} = {}) {
  const endPoint = updatePk ? `${itemPath}${updatePk}` : itemPath;

  const { control, register, handleSubmit, reset, setError, errors } =
    useForm();
  const {
    get,
    post,
    put,
    patch,
    response,
    loading,
    data: resData,
  } = useFetch();

  const onSubmit = handleSubmit(async (data) => {
    let responseData;
    if (updatePk) {
      responseData = updateWithPatch
        ? await patch(endPoint, data)
        : await put(endPoint, data);
    } else {
      responseData = await post(endPoint, data);
    }
    if (response.ok) {
      onSuccess(responseData);
    } else {
      setResponseErrors(setError, responseData);
    }
  });

  const loadDefaultData = useCallback(async () => {
    const itemData = await get(endPoint);
    if (response.ok) setDefaultValues(reset, itemData);
  }, [get, endPoint, response, reset]);

  const nonFieldErros = resData?.non_field_errors;

  useEffect(() => {
    if (updatePk) {
      loadDefaultData();
    }
  }, [updatePk, loadDefaultData]);

  return {
    control,
    register,
    onSubmit,
    errors,
    loading,
    nonFieldErros,
  };
}

export function setResponseErrors(setError, responseErrors) {
  for (const key in responseErrors) {
    setError(key, {
      type: "response",
      message: responseErrors[key].join(","),
    });
  }
}

export function setDefaultValues(reset, defaultData) {
  reset(defaultData);
}
