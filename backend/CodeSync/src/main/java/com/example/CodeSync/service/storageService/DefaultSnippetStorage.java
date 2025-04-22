package com.example.CodeSync.service.storageService;

import com.example.CodeSync.dto.SnippetDto;
import com.example.CodeSync.enums.Language;
import com.example.CodeSync.enums.Paths;
import com.example.CodeSync.model.SnippetItem;
import com.example.CodeSync.service.snowflake.IdGenerator;
import com.example.CodeSync.utility.CodeTemplateFactory;
import com.example.CodeSync.utility.FileUtil;
import com.example.CodeSync.utility.LanguageDetector;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

@Service
public class DefaultSnippetStorage implements SnippetStorage {

    @Autowired
    private FileUtil fileUtil;
    @Autowired
    private IdGenerator snowFlakeID;
    @Autowired
    private LanguageDetector languageDetector;
    @Autowired
    private CodeTemplateFactory codeTemplateFactory;

    @Transactional
    public SnippetItem createSnippet(String name, String parentPath) throws Exception {
        String snippetID = snowFlakeID.generate() + "_" + name;
        String projectID = Arrays.asList(parentPath.split("\\\\")).get(0);
        Language language = languageDetector.detectLanguage(name);
        String content = codeTemplateFactory.getCodeTemplate(language).getTemplate();
        String pathInFileSystem = Paths.Project_Paths.getPath() + "\\" + projectID + "\\" + "snippets" + "\\" + snippetID;
        fileUtil.createFile(pathInFileSystem, content);
        return SnippetItem.builder()
                .name(name)
                .id(snippetID)
                .language(language)
                .path(parentPath + "\\" + name)
                .build();
    }

    public void removeSnippet(SnippetItem snippetItem) throws Exception {
        String snippetID = snippetItem.getId();
        String projectID = snippetItem.getPath().split("\\\\")[0];
        String path = Paths.Project_Paths.getPath() + "\\" + projectID + "\\" + "snippets" + "\\" + snippetID;
        fileUtil.deleteFile(path);
    }

    public void updateSnippet(SnippetDto snippetDto) throws Exception {
        String path = Paths.Project_Paths.getPath() + "\\" + snippetDto.getProjectID() + "\\" + "snippets" + "\\" + snippetDto.getSnippetID();
        if (!fileUtil.checkExistence(path)) {
            fileUtil.createFile(path, snippetDto.getContent());
        } else {
            fileUtil.deleteFile(path);
            fileUtil.createFile(path, snippetDto.getContent());
        }
    }

    public String getSnippetContent(SnippetDto snippetDto) throws Exception {
        String path = Paths.Project_Paths.getPath() + "\\" + snippetDto.getProjectID() + "\\" + "snippets" + "\\" + snippetDto.getSnippetID();
        return fileUtil.readFileContents(path);
    }
}
