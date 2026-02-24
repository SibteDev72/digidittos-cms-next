import Swal from "sweetalert2";

const PRIMARY = "#00859b";
const DANGER = "#ef4444";

export const swalSuccess = (title: string) =>
  Swal.fire({
    icon: "success",
    title,
    position: "center",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

export const swalError = (title: string, text?: string) =>
  Swal.fire({
    icon: "error",
    title,
    text,
    position: "center",
    confirmButtonColor: PRIMARY,
  });

export const swalConfirm = (
  title: string,
  text: string,
  confirmText = "Yes, delete it!",
  confirmColor = DANGER
) =>
  Swal.fire({
    title,
    text,
    icon: "warning",
    position: "center",
    showCancelButton: true,
    confirmButtonColor: confirmColor,
    cancelButtonColor: PRIMARY,
    confirmButtonText: confirmText,
    cancelButtonText: "Cancel",
    reverseButtons: true,
  }).then((result) => result.isConfirmed);
