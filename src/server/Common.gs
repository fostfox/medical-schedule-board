/** Common.gs **/
/**
 * Acquires a script lock to prevent concurrent modifications.
 * Throws an error if the lock cannot be obtained.
 */
function acquireLock() {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch (e) {
    throw new Error("Ошибка: не удалось получить блокировку, попробуйте позже.");
  }
  return lock;
}

function checkPermissions() {
  var user = Session.getActiveUser();
  if (!user || !user.getEmail()) {
    return "Ошибка: Модификация данных не разрешена.";
  }
  return null;
}
