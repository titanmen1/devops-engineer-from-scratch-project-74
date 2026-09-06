// @ts-check

export default {
  translation: {
    appName: "Simple blog",
    layouts: {
      application: {
        articles: "Articles",
      },
      actions: {
        view: "View",
        edit: "Edit",
        delete: "Delete",
      },
    },
    views: {
      article: {
        content: {
          placeholder: "Enter article content",
        },
        create: {
          success: "Article was created",
          error: "Failed to create article",
        },
        edit: {
          success: "Article was updated",
          error: "Failed to update article",
        },
        delete: {
          success: "Article was deleted",
          error: "Failed to delete article",
        },
      },
      articles: {
        index: {
          header: "Articles",
          id: "ID",
          title: "Title",
          createdAt: "Created at",
          actions: "Actions",
          new: "New article",
          delete_confirmation: "Delete confirmation",
        },
        edit: {
          header: "Edit article",
          submit: "Update",
        },
        new: {
          header: "New Article",
          submit: "Create",
        },
      },

      welcome: {
        index: {
          hello: "Hello from Hexlet!",
          description: "Online programming school",
          more: "Learn more",
        },
      },
    },
  },
};
