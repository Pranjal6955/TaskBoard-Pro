/**
 * Verify if a user is authorized to modify a task
 * @param {Object} task - The task document
 * @param {Object} project - The project document
 * @param {String} uid - The user's ID
 * @returns {Boolean} - Whether the user is authorized
 */
export const isAuthorizedForTask = (task, project, uid) => {
  // Check if user is project owner
  const isProjectOwner = project.members.some(
    member => member.userId === uid && member.role === 'owner'
  );

  // Check if user is task assignee
  const isTaskAssignee = task.assignee && task.assignee.userId === uid;

  // Check if user is project member
  const isProjectMember = project.members.some(
    member => member.userId === uid
  );

  // Allow project owners and assignees to do anything
  if (isProjectOwner || isTaskAssignee) return true;

  // Allow project members to view and update status
  return isProjectMember;
};
